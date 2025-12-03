# Article-practice — 後端規格書 (SPEC)

版本: 1.0  
最後更新: 2025-07-12

---

## 1. 系統概述

Article-practice 是一個以 REST API 提供文章與分類資料的後端服務，供前端顯示文章列表與文章詳細頁使用。開發環境以 Docker Compose 啟動三節點 MongoDB replica set 與後端 API。此文件為開發、測試與部署之參考規格。

範圍：

- 公開讀取 API（GET /articles, GET /articles/:id, GET /categories）
- 初始化與種子資料腳本
- (選項) 管理端 CRUD 與授權未在此文件細節化

---

## 2. 功能說明

1. 列表查詢文章（/api/v1/articles/list）

    - 輸入：page, limit, keyword, category
    - 處理：分頁、關鍵字全文檢索、分類過濾、排序
    - 輸出：{ total, page, limit, data: Article[] }

2. 取得單篇文章（/api/v1/articles/:id）

    - 輸入：path param id
    - 處理：以 id 查詢 DB
    - 輸出：Article 或 404

3. 取得分類清單（/api/v1/categories/list）

    - 輸出：Category[]

4. 健康檢查（/health）

    - 回傳服務與 DB 狀態

5. DB 初始化 / seed
    - 建立範例使用者、分類與文章

錯誤處理：統一回傳格式 { success: false, error: { code, message } }。

---

## 3. 技術架構

- 平台：Node.js (LTS)
- Web 框架：Express
- 資料庫：MongoDB（開發：3-node replica set via Docker Compose）
- Container：Docker Compose（development）
- 測試：Jest、Supertest
- 目錄概覽：
    - src/server.js — 啟動
    - src/routes/ — 路由
    - src/controllers/ — 請求處理
    - src/services/ / src/repositories/ — 商業邏輯與 DB 存取
    - src/database/ — init、seed、replica init

開發常用命令：

- docker-compose up -d --build
- docker-compose down -v
- docker-compose logs -f backend
- docker-compose exec backend npm run seed

---

## 4. 數據模型

Article

```ts
interface Article {
    id: string; // ObjectId as string
    title: string;
    content: string;
    author: { id: string; username: string };
    category?: { name: string };
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
}
```

Category

```ts
interface Category {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}
```

User (最小)

```ts
interface User {
    id: string;
    username: string;
}
```

DB 設計要點：

- title/content 建立 text index（全文檢索）
- index: created_at, category.name
- created_at/updated_at 由後端自動維護

---

## 5. 接口規範（Base: /api/v1）

1. GET /articles/list

- Query: page?: number, limit?: number, keyword?: string, category?: string
- 200:

```json
{
    "success": true,
    "data": {
        "total": 123,
        "page": 1,
        "limit": 10,
        "data": [
            /* Article */
        ]
    }
}
```

2. GET /articles/:id

- 200: { "success": true, "data": { /_ Article _/ } }
- 404: { "success": false, "error": { "code": "NOT_FOUND", "message": "Article not found" } }

3. GET /categories/list

- 200: { "success": true, "data": [ { "id","name","created_at","updated_at" } ] }

4. GET /health

- 200: { "status": "ok", "db": "connected" } or { "status": "error", "db": "disconnected" }

安全與版本：

- API prefix: /api/v1
- 認證: Authorization: Bearer <token>（未實作時應回 401）

---

## 6. 算法與關鍵流程

- 分頁：skip = (page-1)\*limit，使用 limit & skip，返回 total via countDocuments 或 aggregation。
- 關鍵字搜尋：MongoDB text index + $text，並可使用 score 排序。
- 分類過濾：category.name 或 category id 作為篩選條件。
- Replica 初始化：init script 執行 rs.initiate() 並加入節點；腳本需檢查已初始化狀態並避免重覆執行。

---

## 7. 性能要求

- 響應時間目標：
    - 95% 的一般 API < 300ms
    - 複雜查詢 < 1s
- 可用性（開發環境）：99%+
- DB 連線池：預設 10（視負載調整）
- 優化建議：使用投影限制欄位、加索引、考慮 Redis 緩存熱門列表

---

## 8. 測試規範與驗收標準

測試層級：

- 單元測試 (Jest)：service、utils、validators；目標覆蓋率 >= 80%
- 集成測試 (Supertest + mongodb-memory-server 或 Docker MongoDB)：routes + controllers
- E2E（可選）：Postman Collection / Cypress

CI 建議 pipeline：

- lint -> unit tests -> integration tests -> build

驗收準則（Acceptance Criteria）：

- /articles/list 與 /articles/:id 正確回傳並含需欄位
- /health 能反映 DB 可用性
- CI pipeline 主要檢查項目通過

---

## 9. 運維與排錯要點

- 日誌：結構化日志（timestamp, level, requestId, path, status, duration）
- 監控：requests/sec、error rate、DB connections、replica set state
- 常見排錯：
    - Replica 未選出 PRIMARY：查看 `docker-compose logs mongo*` 與 init 日誌；如必要執行 `docker-compose down -v` 並刪除 data/ 再重啟
    - Mongo Compass 連線：hosts 需 mapping mongo1/mongo2/mongo3 -> 127.0.0.1
    - Port 被占用：`netstat -aon | findstr :27017` -> kill PID 或重啟 Docker Desktop

快速命令：

- docker-compose down -v && docker-compose up --build
- docker-compose exec mongo1 mongo --eval "rs.status()"

---

## 10. 附錄

- init script: src/database/init-replica.js（或 init-replica container）
- seed: src/database/seeders
- 測試設定：tests/, setup.unit.js, setup.int.js
- 建議進一步工作：
    - 提供 OpenAPI / Swagger 規格
    - 將 types 提供為共用 package，供前後端共享
    - 增加 readiness/liveness endpoints（容器化部署）
    - CI 使用 mongodb-memory-server 以加速測試

---

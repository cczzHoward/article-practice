# 部落格 API 練習專案

這是一個以部落格為主題的練習專案，主要目的是熟悉使用 `Controller -> Service -> Repository -> Model` 架構來開發 API。

## 專案目標
- 學習並實踐分層架構的設計模式。
- 提升 API 開發的技能。
- 熟悉資料庫操作與模型設計。

## 架構說明
1. **Controller**: 負責處理 HTTP 請求，並將請求轉發給對應的 Service。
2. **Service**: 負責業務邏輯處理，並與 Repository 進行互動。
3. **Repository**: 負責與資料庫進行操作。
4. **Model**: 定義資料結構與資料庫映射。

## 功能列表
- 使用者註冊與登入（規劃中）
- 發佈文章
- 編輯文章
- 刪除文章
- 瀏覽文章列表
- 查看文章詳情

## 技術棧
- **後端框架**: Node.js + Express
- **資料庫**: MongoDB（使用 Mongoose ODM）
- **其他工具**: dotenv（環境變數管理）、nodemon（開發用自動重啟）

## 專案結構
```
src/
  app.js                # 應用主入口
  controllers/          # 控制器
  services/             # 業務邏輯
  repositories/         # 資料存取層
  models/               # 資料模型
  routes/               # 路由
  database/dbConnection.js # MongoDB 連線設定
  middlewares/          # 中介層
  utils/                # 工具
```

## 如何啟動專案
1. 複製專案到本地：
    ```bash
    git clone git@github.com:cczzHoward/article-practice.git
    cd article-practice
    ```
2. 安裝依賴：
    ```bash
    npm install
    ```
3. 建立 `.env` 檔案，內容如下：
    ```env
    MONGODB_URI=mongodb://localhost:27017/article-practice
    ```
4. 啟動伺服器：
    ```bash
    npm run app
    ```
5. 伺服器啟動後，預設監聽在 http://localhost:8080

## 資料庫設計
目前已設計 `Article` 資料表，欄位如下：
- `title` (String, 必填)
- `author` (String, 必填)
- `content` (String, 必填)

## 未來規劃
- 增加評論功能
- 增加文章分類功能
- 增加文章搜尋功能
- 完成使用者註冊與登入

歡迎提供建議與回饋！
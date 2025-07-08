# 部落格 API 練習專案

這是一個以部落格為主題的練習專案，採用分層架構（Controller → Service → Repository → Model），並實作 JWT 驗證的註冊、登入、登出、變更密碼與基礎 CRUD。專案已導入 baseController、baseService、baseRepository、baseSchema 以提升可維護性與擴展性，並統一 API 回應格式。

## 專案目標

- 學習並實踐分層架構設計
- 熟悉 Express 與 MongoDB 開發
- 實作安全的使用者認證與授權
- 提升 API 開發、測試與維護能力

## 架構說明

- **Controller**：處理 HTTP 請求與回應，調用 Service。
- **Service**：處理業務邏輯，調用 Repository。
- **Repository**：負責資料存取，與 Model 互動。
- **Model**：定義資料結構與 schema。
- **Base 層**：抽象出 CRUD 共用邏輯，所有資源繼承 base 類別。
- **Middleware**：如 logger、passport 驗證等。
- **Utils**：統一回應格式、日誌等工具。
- **Validator**：集中管理 Joi 驗證規則與 middleware。
- **Seeder**：資料初始化腳本，快速建立測試資料。
- **Test**：分為 unit test 及 integration test，並支援 coverage 報告。

## 功能列表

- [x] 使用者註冊與登入（JWT 驗證）
- [x] 使用者登出（前端移除 token）
- [x] 變更密碼（需登入）
- [x] 發佈、編輯、刪除文章（需登入，權限控管）
- [x] 瀏覽文章列表、查看文章詳情（公開）
- [x] 文章分類功能（Category Model，文章關聯分類）
- [x] 評論功能（留言、刪除、查詢，權限控管）
- [x] 日誌紀錄
- [x] 統一 API 回應格式
- [x] Joi Validator
- [x] 基礎 CRUD base 類別
- [x] Seeder（user、category、article、comment，支援自動關聯）
- [x] 權限控管（admin/user 細緻權限）
- [x] 單元測試與整合測試，含 coverage 報告

## 技術棧

- **後端框架**：Node.js + Express
- **資料庫**：MongoDB（Mongoose ODM）
- **認證**：JWT + Passport + bcrypt
- **驗證**：Joi
- **日誌**：winston
- **測試**：Jest
- **其他工具**：dotenv、nodemon、Postman、Docker Compose

## 專案結構

```
src/
  app.js
  base/
    baseController.js
    baseRepository.js
    baseSchema.js
    baseService.js
  config/
    passport.js
  controllers/
    article.js
    auth.js
    category.js
    user.js
    comment.js
  database/
    dbConnection.js
    seeders/
      user.js
      article.js
      category.js
      comment.js
      index.js
  middlewares/
    auth.js
    logger.js
    passport.js
    validateObjectId.js
  models/
    article.js
    user.js
    category.js
    comment.js
  repositories/
    article.js
    user.js
    category.js
    comment.js
  routes/
    article.js
    auth.js
    category.js
    user.js
    comment.js
  services/
    article.js
    auth.js
    category.js
    user.js
    comment.js
  utils/
    logger.js
    response.js
    logs/
      combined.log
      error.log
  validators/
    article.js
    auth.js
    category.js
    user.js
    comment.js
    validate.js
    common.js
```

## 如何啟動專案 (使用 Docker)

本專案推薦使用 Docker Compose 進行啟動，可以一鍵部署後端應用程式與 MongoDB Replica Set 資料庫叢集。

**前置需求：** 請先安裝 [Docker](https://www.docker.com/) 與 [Docker Compose](https://docs.docker.com/compose/install/)。

1.  **複製專案到本地：**

    ```bash
    git clone git@github.com:cczzHoward/article-practice.git
    cd article-practice
    ```

2.  **設定環境變數：**
    專案根目錄下通常會有一個 `docker.env` 檔案，用於 Docker 環境。如果此檔案不存在，請手動建立一個，並填入以下內容作為範例：

    ```env
    # docker.env
    MONGODB_URI=mongodb://mongo1:27017,mongo2:27017,mongo3:27017/article-practice?replicaSet=rs0

    BCRYPT_SALT_ROUNDS=10
    JWT_SECRET='your_super_secret_for_jwt'
    JWT_EXPIRATION='1h'
    ```

    `MONGODB_URI` 已設定為容器間的連線位址，通常不需修改。請務必將 `JWT_SECRET` 更換為您自己的安全密鑰。

3.  **啟動所有服務：**

    ```bash
    docker-compose up -d --build
    ```

    此指令會建置後端服務的 Docker image，並在背景啟動後端服務與三個 MongoDB 節點。

4.  **確認服務狀態：**

    ```bash
    docker-compose ps
    ```

    若 `backend`、`mongo1`、`mongo2`、`mongo3`、`init-replica` 服務的狀態 (State/Status) 皆為 `Up` 或 `healthy`，表示服務已成功啟動。

5.  **執行 Seeder 初始化資料：**
    在另一個終端機視窗，進入專案目錄後執行以下指令，進入後端容器並執行 seeder：

    ```bash
    docker-compose exec backend npm run seed
    ```

6.  **完成！**

    - 後端 API 服務運行於： `http://localhost:8080`
    - MongoDB Replica Set 可透過以下連線字串從本機 (例如使用 MongoDB Compass) 連線：
        ```
        mongodb://localhost:27017,localhost:27018,localhost:27019/article-practice?replicaSet=rs0
        ```

7.  **關閉服務：**
    ```bash
    docker-compose down
    ```

## 主要 API 路徑範例

- `POST   /api/v1/users/register` 註冊
- `POST   /api/v1/users/login` 登入
- `POST   /api/v1/users/change-password` 變更密碼（需登入）
- `POST   /api/v1/users/logout` 登出（前端移除 token，無後端 API）
- `DELETE /api/v1/users/:id` 刪除用戶（需登入，僅限本人或管理員，管理員不能刪自己）
- `GET    /api/v1/articles/list` 文章列表（公開）
- `GET    /api/v1/articles/:id` 文章詳情（公開）
- `POST   /api/v1/articles/` 新增文章（需登入）
- `PATCH  /api/v1/articles/:id` 編輯文章（需登入，僅限作者本人或管理員）
- `DELETE /api/v1/articles/:id` 刪除文章（需登入，僅限作者本人或管理員）
- `POST   /api/v1/comments/:articleId` 新增評論（需登入）
- `DELETE /api/v1/comments/:id` 刪除評論（需登入，僅限評論作者或管理員）

## 資料庫設計

### User

- `username` (String, 必填, 唯一)
- `password` (String, 必填, 加密)
- `role` (String, 必填, 預設 'user'，可為 'admin' 或 'user')
- `postedArticles` (Array<ObjectId>, 參照 Article，預設空陣列)
- `created_at` (Date)
- `updated_at` (Date)

### Category

- `name` (String, 必填, 唯一)
- `created_at` (Date)
- `updated_at` (Date)

### Article

- `title` (String, 必填)
- `author` (ObjectId, 必填, 參照 User)
- `category` (ObjectId, 必填, 參照 Category)
- `content` (String, 必填)
- `comments` (Array<ObjectId>, 參照 Comment, 預設空陣列)
- `created_at` (Date)
- `updated_at` (Date)

### Comment

- `article` (ObjectId, 必填, 參照 Article)
- `author` (ObjectId, 必填, 參照 User)
- `content` (String, 必填)
- `created_at` (Date)
- `updated_at` (Date)

## 統一回應格式

所有 API 回應皆為以下格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

或

```json
{
    "success": false,
    "message": "錯誤訊息",
    "data": null
}
```

## 認證與授權

- 註冊與登入 API 會產生 JWT，前端需將 token 存於 localStorage 或 header。
- 受保護的 API 需在 header 加上 `Authorization: Bearer <token>`。
- 使用 passport-jwt 驗證 token，並將用戶資訊掛載於 `req.user`。
- 密碼加密採用 bcrypt，密碼長度與格式由 Joi 驗證。
- 登出僅需前端移除 token，後端不維護黑名單。
- 權限控管涵蓋文章、評論、用戶等資源，細緻區分 admin/user 權限。

## Joi Validator 使用說明

- 所有請求參數驗證皆集中於 `src/validators/`，每個資源一個檔案（如 `auth.js`, `article.js`, `comment.js`）。
- 驗證 middleware 統一由 `validate.js` 提供，路由中直接使用。
- 針對 ObjectId 格式驗證，已抽出共用 middleware（`validateObjectId.js`）。
- 範例：
    ```js
    const validate = require('../validators/validate');
    const { registerSchema } = require('../validators/auth');
    router.post('/register', validate(registerSchema), AuthController.register);
    ```

## Seeder 使用說明

- Seeder 腳本集中於 `src/database/seeders/`。
- 執行 `docker-compose exec backend npm run seed` 會依序初始化預設分類、用戶、文章、評論資料，並自動關聯正確的 ObjectId。
- 如需自訂初始資料，請編輯 `user.js`、`category.js`、`article.js`、`comment.js`。
- 可依需求擴充更多 seeder 檔案。

## 日誌管理

- 所有 API 請求與錯誤皆會記錄於 `src/utils/logs/combined.log` 及 `error.log`。
- 日誌格式與等級可於 [`src/utils/logger.js`](src/utils/logger.js) 設定。

## 文章搜尋與分頁

- `/api/v1/articles/list` 路由支援以下 query string：
    - `keyword`：標題或內容模糊搜尋
    - `category`：分類名稱（如 "前端"、"後端"），自動轉換為對應的 category ObjectId 查詢
    - `page`：分頁，預設 1
    - `limit`：每頁筆數，預設 10
- 回傳格式包含：`data`（文章陣列）、`total`（總筆數）、`page`、`limit`、`totalPages`
- 預設依 `created_at` 由新到舊排序
- 範例：
    ```
    GET /api/v1/articles/list?keyword=node&page=2&limit=5&category=前端
    ```

## 權限與身分管理

- 🛡️ **身分功能（管理員、一般使用者）**
    - 使用者模型（User Model）有 `role` 欄位，預設為 `"user"`，管理員為 `"admin"`。
    - JWT 登入時會帶入 `role` 權限資訊，並於 Passport 驗證後掛載於 `req.user`。
    - 路由層已加入權限 middleware：
        - **管理員（admin）** 可管理所有文章、評論，且只能刪除自己以外的用戶帳號。
        - **一般使用者（user）** 僅能管理自己的內容（如：只能編輯/刪除自己發表的文章、評論，僅能刪除自己的帳號）。
    - 文章、評論相關 API（編輯、刪除）已於 route 層加入權限控管 middleware。
    - 用戶管理相關 API（如：刪除用戶）已支援細緻權限控管，詳見 [`src/middlewares/auth.js`](src/middlewares/auth.js) 及 [`src/routes/user.js`](src/routes/user.js)。

### 權限範例

- `POST   /api/v1/articles/` 新增文章（需登入，所有用戶皆可）
- `PATCH  /api/v1/articles/:id` 編輯文章（僅作者本人或管理員可編輯）
- `DELETE /api/v1/articles/:id` 刪除文章（僅作者本人或管理員可刪除）
- `POST   /api/v1/comments/:articleId` 新增評論（需登入，所有用戶皆可）
- `DELETE /api/v1/comments/:id` 刪除評論（僅評論作者或管理員可刪除）
- `DELETE /api/v1/users/:id` 刪除用戶（管理員只能刪除自己以外的用戶，一般用戶只能刪除自己）

> 權限相關邏輯請參考 [`src/middlewares/auth.js`](src/middlewares/auth.js) 及 [`src/routes/article.js`](src/routes/article.js)、[`src/routes/user.js`](src/routes/user.js)

## 單元測試與覆蓋率

- **測試覆蓋範圍**：已涵蓋 Controller、Service、Repository、Middleware、Utils、Validator、Model 各層，包含自訂 schema method（如 `comparePassword`）、pre-save hook，以及評論（Comment）功能的 CRUD 流程。
- **測試結構**：測試檔案分布於 `tests/` 目錄下，依層級分類（如 `tests/controllers/`、`tests/services/`、`tests/integration/` 等）。
- **測試框架**：採用 Jest，所有測試可於本地直接執行，無需額外設定。
- **執行測試**：
    ```bash
    npm test
    ```
- **產生 coverage 報告**：
    ```bash
    npm run test:coverage
    ```
    產生報告於 `coverage/lcov-report/index.html`，可用瀏覽器開啟檢視每個檔案的覆蓋率。
- **查找低覆蓋率檔案**：可依 coverage 報告追蹤尚未覆蓋的程式碼區塊，針對性補強測試。
- **Jest 進階 matcher**：測試中大量運用 `expect.arrayContaining`、`expect.stringContaining`、`toMatch` 等 matcher，提升測試彈性。
- **整合測試**：已針對主要 API（使用者、文章、分類、評論）進行 integration test，驗證實際 API 串接與資料庫互動流程。

---

## 未來規劃

- 🧪 **持續優化測試與覆蓋率**  
  針對低覆蓋率區塊補強測試，並持續優化 integration test 覆蓋面。

歡迎提供建議與回饋！

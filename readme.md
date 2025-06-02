# 部落格 API 練習專案

這是一個以部落格為主題的練習專案，採用分層架構（Controller → Service → Repository → Model），並實作 JWT 驗證的註冊、登入、登出、變更密碼與基礎 CRUD。專案已導入 baseController、baseService、baseRepository、baseSchema 以提升可維護性與擴展性，並統一 API 回應格式。  

## 專案目標
- 學習並實踐分層架構設計
- 熟悉 Express 與 MongoDB 開發
- 實作安全的使用者認證與授權
- 提升 API 開發與維護能力

## 架構說明
- **Controller**：處理 HTTP 請求與回應，調用 Service。
- **Service**：處理業務邏輯，調用 Repository。
- **Repository**：負責資料存取，與 Model 互動。
- **Model**：定義資料結構與 schema。
- **Base 層**：抽象出 CRUD 共用邏輯，所有資源繼承 base 類別。
- **Middleware**：如 logger、passport 驗證等。
- **Utils**：統一回應格式、日誌等工具。
- **Seeder**：資料初始化腳本，快速建立測試資料。

## 功能列表
- [x] 使用者註冊與登入（JWT 驗證）
- [x] 使用者登出（前端移除 token）
- [x] 變更密碼（需登入）
- [x] 發佈、編輯、刪除文章（需登入）
- [x] 瀏覽文章列表、查看文章詳情（公開）
- [x] 日誌紀錄（winston）
- [x] 統一 API 回應格式
- [x] 基礎 CRUD base 類別實作
- [x] Seeder（資料初始化腳本）

## 技術棧
- **後端框架**：Node.js + Express
- **資料庫**：MongoDB（Mongoose ODM）
- **認證**：JWT + Passport + bcrypt
- **日誌**：winston
- **其他工具**：dotenv、nodemon、Postman

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
  database/
    dbConnection.js
    seeders/
      user.js
      article.js
      index.js
  middlewares/
    auth.js
    logger.js
    passport.js
  models/
    article.js
    user.js
  repositories/
    article.js
    user.js
  routes/
    article.js
    auth.js
  services/
    article.js
    auth.js
  utils/
    logger.js
    response.js
    logs/
      combined.log
      error.log
```

## 如何啟動專案
1. 複製專案到本地：
    ```bash
    git clone <your-repo-url>
    cd article-practice
    ```
2. 安裝依賴：
    ```bash
    npm install
    ```
3. 建立 `.env` 檔案，內容如下：
    ```env
    MONGODB_URI=mongodb://localhost:27017/article-practice
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRATION=1h
    BCRYPT_SALT_ROUNDS=10
    ```
4. 啟動伺服器：
    ```bash
    npm run app
    ```
5. 執行 Seeder 初始化資料：
    ```bash
    npm run seed
    ```
6. 伺服器啟動後，預設監聽在 http://localhost:8080

## 主要 API 路徑範例

- `POST   /api/v1/users/register`         註冊
- `POST   /api/v1/users/login`            登入
- `POST   /api/v1/users/change-password`  變更密碼（需登入）
- `POST   /api/v1/users/logout`           登出（前端移除 token）
- `GET    /api/v1/articles/list`          文章列表（公開）
- `GET    /api/v1/articles/:id`           文章詳情（公開）
- `POST   /api/v1/articles/`              新增文章（需登入）
- `PATCH  /api/v1/articles/:id`           編輯文章（需登入）
- `DELETE /api/v1/articles/:id`           刪除文章（需登入）

## 資料庫設計
### User
- `username` (String, 必填, 唯一)
- `password` (String, 必填, 加密)
- `created_at` (Date)
- `updated_at` (Date)

### Article
- `title` (String, 必填)
- `author` (String, 必填)
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
- 密碼加密採用 bcrypt。
- 登出僅需前端移除 token，後端不維護黑名單。

## 日誌管理
- 所有 API 請求與錯誤皆會記錄於 `src/utils/logs/combined.log` 及 `error.log`。
- 日誌格式與等級可於 `src/utils/logger.js` 設定。

## 未來規劃
- 增加評論功能
- 增加文章分類功能
- 增加文章搜尋功能
- 完善使用者權限管理
- 增加 Validator（統一請求參數驗證）

歡迎提供建議與回饋！
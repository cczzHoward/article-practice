# 部落格 API 練習專案

這是一個以部落格為主題的練習專案，主要目的是熟悉使用 `Controller -> Service -> Repository -> Model` 架構來開發 API，並實作 JWT 驗證的登入/登出功能。

## 專案目標
- 學習並實踐分層架構的設計模式。
- 提升 API 開發的技能。
- 熟悉資料庫操作與模型設計。
- 實作安全的使用者認證與授權。

## 架構說明
1. **Controller**: 負責處理 HTTP 請求，並將請求轉發給對應的 Service。
2. **Service**: 負責業務邏輯處理，並與 Repository 進行互動。
3. **Repository**: 負責與資料庫進行操作。
4. **Model**: 定義資料結構與資料庫映射。

## 功能列表
- [x] 使用者註冊與登入（JWT 驗證）
- [x] 使用者登出（前端移除 token）
- [x] 發佈文章
- [x] 編輯文章
- [x] 刪除文章
- [x] 瀏覽文章列表
- [x] 查看文章詳情

## 技術棧
- **後端框架**: Node.js + Express
- **資料庫**: MongoDB（使用 Mongoose ODM）
- **認證**: JWT + Passport + bcrypt
- **其他工具**: dotenv（環境變數管理）、nodemon（開發用自動重啟）、winston（日誌管理）、Postman（API 測試）

## 專案結構
```
src/
  app.js                # 應用主入口
  config/               # 設定檔（如 passport.js）
  controllers/          # 控制器
  services/             # 業務邏輯
  repositories/         # 資料存取層
  models/               # 資料模型
  routes/               # 路由
  database/dbConnection.js # MongoDB 連線設定
  middlewares/          # 中介層（如 passport.js, auth.js）
  utils/                # 工具
    logger.js           # 日誌工具
    logs/               # 日誌檔案資料夾
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
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRATION=1h
    BCRYPT_SALT_ROUNDS=10
    ```
4. 啟動伺服器：
    ```bash
    npm run app
    ```
5. 伺服器啟動後，預設監聽在 http://localhost:8080

## 資料庫設計
### User
- `username` (String, 必填, 唯一)
- `password` (String, 必填, 加密)
- `createAt` (Date)
- `updateAt` (Date)

### Article
- `title` (String, 必填)
- `author` (String, 必填)
- `content` (String, 必填)
- `createAt` (Date)
- `updateAt` (Date)


## 認證與授權
- 註冊與登入 API 會產生 JWT，前端需將 token 存於 localStorage 或 header。
- 受保護的 API 需在 header 加上 `Authorization: Bearer <token>`。
- 使用 passport-jwt 驗證 token，並將用戶資訊掛載於 `req.user`。
- 密碼加密採用 bcrypt。

## 日誌管理
- 所有 API 請求與錯誤皆會記錄於 `src/utils/logs/combined.log` 及 `error.log`。
- 日誌格式與等級可於 `src/utils/logger.js` 設定。

## 未來規劃
- 增加評論功能
- 增加文章分類功能
- 增加文章搜尋功能
- 完善使用者權限管理

歡迎提供建議與回饋！
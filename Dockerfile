# 步驟 1: 選擇一個官方的 Node.js 映像檔作為基礎
# alpine 版本體積小，適合用於部署
FROM node:18-alpine

# 步驟 2: 在容器內建立一個工作目錄
WORKDIR /usr/src/app

# 步驟 3: 複製 package.json 和 package-lock.json
# 這樣可以利用 Docker 的快取機制，只有在依賴變更時才重新安裝
COPY package*.json ./

# 步驟 4: 安裝所有依賴 (包括 devDependencies，因為我們開發時需要 nodemon)
RUN npm install

# 步驟 5: 將專案的所有原始碼複製到工作目錄
COPY . .

# 步驟 6: 向 Docker 宣告容器將會監聽的網路端口 (僅為文件作用)
EXPOSE 8080

# 步驟 7: 設定容器啟動時的預設命令
# 這個命令會在開發模式中被 docker-compose 覆寫
CMD [ "npm", "run", "watch" ]
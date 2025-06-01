## React+TypeScriptアプリの作成

```
npx create-react-app expiry-tracker --template typescript
cd expiry-tracker
npm start
```

・src/App.tsxを書き換えてUIを整える

## Node.js + ExpressでLINE通知バックエンドを作る

```
mkdir backend
cd backend
npm init -y
npm install express @line/bot-sdk dotenv
npm install -D typescript ts-node @types/express
npx tsc --init
```

・src/server.tsを書く  
・ .env の中身（LINEコンソールから取得）    
・サーバーの起動 

```
npx ts-node src/server.ts
```
・ブラウザまたはcurlでアクセス：
```
curl http://localhost:3001/notify
```

### DockerでReact + Expressをローカルで動かす

・Dockerfileを作成
```
ExpireNotifyApp/
├── expiry-tracker/      ← Reactフロントエンド
│   └── Dockerfile
├── backend/             ← Express + LINE通知
│   └── Dockerfile
└── docker-compose.yml   ← 両者を起動する設定
```
・docker-compose.yml を作成  
・docker起動  
・docker desktop起動  
・プロジェクトルート（ExpireNotifyApp/）で以下を実行：
```
docker-compose up --build
```
• http://localhost:3000 → Reactアプリ
• http://localhost:3001/notify → Express通知API（LINE通知が飛ぶ）
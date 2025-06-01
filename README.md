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
・ .env の中身書く（LINEコンソールから取得）    
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
・docker desktop起動  
・docker起動  
    プロジェクトルート（ExpireNotifyApp/）で以下を実行：  
    ※ ここでdocker-compose upを実行してローカルでビルドした場合、armベースのノードが作成され、後にEKSにpush後ビルドした時にt3インスタンス(amdベース)と互換性がないためエラーとなる。ローカルでamdベースでビルドしておく必要がある。
```
# React（frontend）
docker build --platform linux/amd64 -t expiry-tracker-frontend .

# Express（backend）
docker build --platform linux/amd64 -t expiry-tracker-backend .
```
```
# フロントエンド
docker run -p 3000:3000 expiry-tracker-frontend

# バックエンド
docker run -p 3001:3001 expiry-tracker-backend
```
• http://localhost:3000 → Reactアプリ  
• http://localhost:3001/notify → Express通知API（LINE通知が飛ぶ）

## ECR (Amazon Elastic Container Registry) にDockerイメージをPushする
・ECR リポジトリを作成
```
aws ecr create-repository \
  --repository-name expiry-tracker-frontend \
  --region ap-northeast-1
```
```
aws ecr create-repository \
  --repository-name expiry-tracker-backend \
  --region ap-northeast-1
```

・ECRにログイン
```
aws ecr get-login-password --region ap-northeast-1 | \
docker login --username AWS \
--password-stdin <アカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com
```

・Dockerイメージにタグ付けしてPush
```
docker tag expiry-tracker-frontend:latest \
<アカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com/expiry-tracker-frontend:latest

docker push <アカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com/expiry-tracker-frontend:latest
```
```
docker tag expiry-tracker-backend:latest \
<アカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com/expiry-tracker-backend:latest

docker push <アカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com/expiry-tracker-backend:latest
```

## EKSクラスタ作成とデプロイ

・クラスタを作成
```
eksctl create cluster \
--name expiry-notify-cluster \
--region ap-northeast-1 \
--nodes 2 \
--node-type t3.medium \
--with-oidc \
--managed
```

・kubectl動作確認
```
kubectl get nodes
```

・Kubernetesマニフェストを適用
frontend-deployment.yaml,backend-deployment.yamlを作成
```
ExpireNotifyApp/
├── expiry-tracker/          ← React (frontend)
├── backend/                 ← Express (backend)
├── docker-compose.yml
└── k8s/                     ← ← ← Kubernetes用YAML置き場
    ├── frontend-deployment.yaml
    └──  backend-deployment.yaml
```

・適用コマンド
```
kubectl apply -f frontend-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
```

・確認コマンド
```
kubectl get pods
kubectl get services
```

・エラーが起きている際はPodの詳細ログを見る
```
kubectl describe pod <Pod名>
```
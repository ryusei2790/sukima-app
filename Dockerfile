# 開発用 Dockerfile
# Node.js 20 Alpine を使用（軽量）
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係ファイルを先にコピー（キャッシュ活用）
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# Next.js の開発サーバーポート
EXPOSE 3000

# 開発サーバーを起動（ホットリロード対応）
CMD ["npm", "run", "dev"]

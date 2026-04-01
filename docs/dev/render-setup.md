# Render セットアップ手順

## PostgreSQL のホスティング

### 1. Render でDBを作成

1. [render.com](https://render.com) にログイン
2. `New` → `PostgreSQL` を選択
3. 以下を設定：
   - **Name**：`sukima-db`（任意）
   - **Region**：Singapore（日本に近い）
   - **Plan**：Free
4. `Create Database` をクリック
5. 作成後、`External Database URL` をコピーする

### 2. DATABASE_URL の設定

`.env` ファイル（ローカル用・gitignore済み）：

```env
DATABASE_URL="取得したExternal Database URL"
JWT_SECRET="openssl rand -base64 32 で生成した文字列"
```

### 3. マイグレーション実行

```bash
npx prisma migrate dev --name init
```

---

## Render への Next.js デプロイ（必要な場合）

### ビルドコマンド

```bash
npx prisma generate && npx prisma migrate deploy && npm run build
```

### 環境変数（Render ダッシュボードで設定）

| 変数名 | 値 |
|--------|----|
| DATABASE_URL | Render PostgreSQL の Internal Database URL |
| JWT_SECRET | 秘密鍵 |
| NODE_ENV | production |

---

## 注意事項

- Render 無料プランの PostgreSQL は **90日間アクセスがないと停止**
- External URL（ローカル開発用）と Internal URL（Render内デプロイ用）は別
- `prisma/migrations/` はgitにコミットすること（デプロイ時に使用される）

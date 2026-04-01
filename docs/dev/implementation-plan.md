# 実装計画

## 実装ステップ

### Step 1：依存パッケージのインストール

```bash
npm install prisma @prisma/client jose bcryptjs
npm install -D @types/bcryptjs
npx prisma init
```

### Step 2：Prisma スキーマ定義

ファイル：`prisma/schema.prisma`

- User モデル（id, email, password, createdAt）
- Task モデル（id, label, userId, createdAt）

### Step 3：lib 層の実装

| ファイル | 内容 |
|----------|------|
| `src/lib/db.ts` | Prisma Client シングルトン |
| `src/lib/auth.ts` | JWT発行（signToken）・検証（verifyToken） |

### Step 4：API Routes の実装

| ファイル | 内容 |
|----------|------|
| `src/app/api/auth/login/route.ts` | POST: メール/パスワード照合→JWT発行→Cookie |
| `src/app/api/auth/logout/route.ts` | POST: Cookie削除 |
| `src/app/api/auth/signup/route.ts` | POST: メール/パスワード受け取り→bcryptハッシュ化→DB保存 |
| `src/app/api/tasks/route.ts` | GET: タスク取得 / POST: タスク追加 |
| `src/app/api/tasks/[id]/route.ts` | DELETE: タスク削除 |

### Step 5：ページの実装

| ファイル | 内容 |
|----------|------|
| `src/app/login/page.tsx` | メール/パスワードフォーム |
| `src/app/signup/page.tsx` | 新規ユーザー登録フォーム（メール/パスワード） |
| `src/app/set/page.tsx` | タスク一覧・追加・削除UI |

### Step 6：既存 page.tsx の修正

- `tasks.ts` のハードコードを直接使う→ `GET /api/tasks` から取得に変更
- 未ログイン時はAPIがデフォルトタスクを返す

### Step 7：docker-compose.yml の更新

- PostgreSQL コンテナを追加（ローカル開発用）
- `DATABASE_URL` 環境変数の設定

### Step 8：Render へのデプロイ設定

- Render で PostgreSQL を作成
- `DATABASE_URL` を環境変数に設定
- `prisma migrate deploy` をビルドコマンドに追加

---

## 環境変数

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="ランダムな秘密鍵（32文字以上）"
```

---

## 実装順序の依存関係

```
Step1（パッケージ）
  → Step2（スキーマ）
    → Step3（lib層）
      → Step4（API）
        → Step5（ページ）
          → Step6（既存修正）
```

Step7・Step8 はローカル動作確認後に並行実施。

---

## 決定事項

- [x] サインアップ方式：パターンB（誰でも `/signup` で自由登録）を採用
  - ユーザーがブラウザからメール/パスワードで新規登録可能
  - 管理者（開発者）は直接SQLでDBを操作することも可能（両立する）

# 隙間時間ルーレット

隙間時間に「次にやること」を即決するシンプルなWebアプリ。

## 起動手順

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く。

### 3. ビルド（本番用）

```bash
npm run build
npm start
```

## 使い方

1. 「回す」ボタンを押す
2. 約1.5秒後にタスクが表示される
3. 「もう一度」を押すと再抽選できる

## タスクの変更方法

`src/data/tasks.ts` の配列を直接編集する。

```ts
export const tasks: Task[] = [
  { id: "read", label: "本を読む" },
  { id: "breath", label: "深呼吸する" },
  // ここに追加・変更する
];
```

## ファイル構成

```
src/
├── app/page.tsx          # メイン画面（状態管理・UI）
├── data/tasks.ts         # タスク一覧（ハードコード）
└── lib/pickRandom.ts     # 等確率抽選ロジック
```

## 動作環境

- Node.js 18 以上
- Next.js 15 + React 19 + Tailwind CSS

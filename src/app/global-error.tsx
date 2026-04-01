"use client";

/**
 * global-error.tsx
 * 役割: アプリ全体のクリティカルエラー（root layout のクラッシュなど）をキャッチする
 *
 * なぜこのファイルが必要か:
 * Next.js は /_global-error をプリレンダリングする際に root layout を使わず
 * このコンポーネント単体でレンダリングする。
 * そのため usePathname など Context に依存するコンポーネント（Nav など）を
 * 含めないシンプルな構成にする必要がある。
 */

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-xl font-semibold text-gray-800">
          予期しないエラーが発生しました
        </h1>
        <button
          onClick={reset}
          className="px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-600 transition-colors"
        >
          再試行
        </button>
      </body>
    </html>
  );
}

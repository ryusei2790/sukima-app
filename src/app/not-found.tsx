/**
 * not-found.tsx
 * 役割: 404 ページのカスタム表示
 *
 * なぜこのファイルが必要か:
 * Next.js は /_not-found をプリレンダリングする際に root layout と組み合わせて
 * レンダリングを試みるが、layout に含まれる Nav（usePathname を使用）が
 * プリレンダリング時に Context null エラーを起こすため、
 * このファイルでシンプルな 404 画面を提供して回避する。
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-2xl font-semibold text-gray-800">
        404 - ページが見つかりません
      </h1>
      <Link
        href="/"
        className="px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-600 transition-colors"
      >
        トップへ戻る
      </Link>
    </div>
  );
}

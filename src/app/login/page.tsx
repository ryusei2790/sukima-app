"use client";

/**
 * login/page.tsx
 * 役割: メール/パスワードでログインするフォームページ
 *
 * 処理フロー:
 * フォーム送信 → POST /api/auth/login → 成功時 / へリダイレクト
 */

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "ログインに失敗しました");
      return;
    }

    router.push("/");
    router.refresh(); // サーバーコンポーネントのキャッシュを更新
  };

  return (
    <main className="min-h-[calc(100vh-56px)] bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-xl font-semibold text-gray-700 mb-8">ログイン</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-gray-600">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            placeholder="example@email.com"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-gray-600">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            placeholder="8文字以上"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-6 py-2 border border-gray-400 rounded-lg text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "ログイン中…" : "ログイン"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-400">
        アカウントがない方は{" "}
        <Link href="/signup" className="text-gray-600 underline">
          新規登録
        </Link>
      </p>
    </main>
  );
}

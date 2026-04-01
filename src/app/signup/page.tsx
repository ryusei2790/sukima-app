"use client";

/**
 * signup/page.tsx
 * 役割: 新規ユーザー登録フォームページ（パターンB: 誰でも自由登録）
 *
 * 処理フロー:
 * フォーム送信 → POST /api/auth/signup → 成功時 /login へリダイレクト
 */

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "登録に失敗しました");
      return;
    }

    // 登録後はログインページへ誘導
    router.push("/login");
  };

  return (
    <main className="min-h-[calc(100vh-56px)] bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-xl font-semibold text-gray-700 mb-8">新規登録</h1>

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
            minLength={8}
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
          {loading ? "登録中…" : "登録する"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-400">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-gray-600 underline">
          ログイン
        </Link>
      </p>
    </main>
  );
}

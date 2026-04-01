"use client";

/**
 * set/page.tsx
 * 役割: ログインユーザーが自分のタスクを管理（追加・削除）するページ
 *
 * 処理フロー:
 * - マウント時: GET /api/tasks でタスク一覧を取得
 * - 追加: POST /api/tasks → 一覧を再取得
 * - 削除: DELETE /api/tasks/:id → 一覧をローカル更新
 * - 未ログイン時は /login へリダイレクト
 */

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Task = {
  id: string;
  label: string;
};

export default function SetPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // マウント時にタスク取得（401なら未ログインとしてリダイレクト）
  useEffect(() => {
    fetch("/api/tasks")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setTasks(data);
      })
      .catch(() => setError("タスクの取得に失敗しました"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    setAdding(true);
    setError(null);

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel.trim() }),
    });

    setAdding(false);

    if (!res.ok) {
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "追加に失敗しました");
      return;
    }

    const task: Task = await res.json();
    setTasks((prev) => [...prev, task]);
    setNewLabel("");
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });

    if (!res.ok) {
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      setError("削除に失敗しました");
      return;
    }

    // ローカルステートから即座に除去（再フェッチ不要）
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-white flex items-center justify-center">
        <div
          className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"
          role="status"
          aria-label="読み込み中"
        />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-white flex flex-col items-center px-4 pt-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-700">タスク管理</h1>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ログアウト
          </button>
        </div>

        {/* タスク追加フォーム */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="新しいタスクを入力"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
          />
          <button
            type="submit"
            disabled={adding || !newLabel.trim()}
            className="px-4 py-2 border border-gray-400 rounded-lg text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            追加
          </button>
        </form>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {/* タスク一覧 */}
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            タスクがありません。追加してください。
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3"
              >
                <span className="text-sm text-gray-700">{task.label}</span>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={`${task.label}を削除`}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

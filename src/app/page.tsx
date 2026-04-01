"use client";

/**
 * page.tsx（ルーレットメインページ）
 * 役割: タスクをAPIから取得してルーレット抽選を行う
 *
 * 変更点（旧→新）:
 * - ハードコードの tasks.ts を直接参照 → GET /api/tasks から取得
 * - 未ログイン: デフォルトタスクが返ってくる（API側で処理）
 * - ログイン済み: ユーザー固有タスクが返ってくる
 */

import { useState, useEffect } from "react";
import { pickRandom } from "@/lib/pickRandom";

type Task = {
  id: string;
  label: string;
};

/** アプリの状態 */
type AppState = "idle" | "spinning" | "result";

/** 演出時間（ミリ秒） */
const SPIN_DURATION_MS = 1500;

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<Task | null>(null);

  // マウント時にAPIからタスクを取得
  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data))
      .catch(() => {
        // APIが使えない場合は空のまま（タスク未登録として扱う）
      });
  }, []);

  /** 抽選を開始する */
  const handleSpin = () => {
    if (state !== "idle") return;
    setState("spinning");
    setTimeout(() => {
      const picked = pickRandom(tasks);
      setResult(picked);
      setState("result");
    }, SPIN_DURATION_MS);
  };

  /** idle 状態に戻す */
  const handleReset = () => {
    setResult(null);
    setState("idle");
  };

  return (
    <main className="min-h-[calc(100vh-56px)] bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-semibold text-gray-700 mb-12 tracking-wide">
        隙間時間ルーレット
      </h1>

      {/* ルーレット表示エリア */}
      <div className="w-72 h-48 border border-gray-200 rounded-xl flex items-center justify-center mb-10">
        {state === "idle" && (
          <p className="text-gray-400 text-sm">ボタンを押して抽選</p>
        )}

        {state === "spinning" && (
          <div
            className="w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"
            role="status"
            aria-label="抽選中"
          />
        )}

        {state === "result" && (
          <>
            {result ? (
              <p className="text-4xl font-bold text-gray-800">{result.label}</p>
            ) : (
              <p className="text-sm text-red-500">
                タスクが登録されていません
              </p>
            )}
          </>
        )}
      </div>

      {/* ボタンエリア */}
      {state === "idle" && (
        <button
          onClick={handleSpin}
          className="px-10 py-3 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors text-base"
        >
          回す
        </button>
      )}

      {state === "spinning" && (
        <button
          disabled
          className="px-10 py-3 border border-gray-200 rounded-lg text-gray-300 cursor-not-allowed text-base"
        >
          回す
        </button>
      )}

      {state === "result" && (
        <button
          onClick={handleReset}
          className="px-10 py-3 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors text-base"
        >
          もう一度
        </button>
      )}
    </main>
  );
}

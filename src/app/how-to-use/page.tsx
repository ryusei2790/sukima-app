import Image from "next/image";
import { tasks } from "@/data/tasks";

/** スペース・@ を含むファイル名をURLエンコードした定数 */
const IMAGES = {
  idle: "/images/CleanShot%202026-03-06%20at%2022.46.23%402x.png",
  result: "/images/CleanShot%202026-03-06%20at%2022.46.29%402x.png",
  codeTask: "/images/CleanShot%202026-03-06%20at%2022.45.52%402x.png",
  codeRandom: "/images/CleanShot%202026-03-06%20at%2022.46.04%402x.png",
} as const;

/** 使い方ページ */
export default function HowToUsePage() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-700 mb-10 tracking-wide text-center">
          使い方
        </h1>

        {/* 基本の流れ */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-gray-600 mb-6">
            基本の流れ
          </h2>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* idle 状態 */}
            <figure className="flex-1">
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <Image
                  src={IMAGES.idle}
                  alt="初期状態：ボタンを押して抽選と表示されたルーレット画面"
                  width={460}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
              <figcaption className="text-xs text-gray-400 text-center mt-2">
                初期状態
              </figcaption>
            </figure>

            {/* result 状態 */}
            <figure className="flex-1">
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <Image
                  src={IMAGES.result}
                  alt="結果表示状態：タスク名が大きく表示されたルーレット画面"
                  width={460}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
              <figcaption className="text-xs text-gray-400 text-center mt-2">
                結果表示
              </figcaption>
            </figure>
          </div>

          <ol className="space-y-4 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="font-semibold text-gray-400 w-6 shrink-0">1.</span>
              <span>アプリを開くと「ボタンを押して抽選」と表示されます。</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-gray-400 w-6 shrink-0">2.</span>
              <span>「回す」ボタンを押すと、約1.5秒間スピナーが回転します。</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-gray-400 w-6 shrink-0">3.</span>
              <span>タスク名が大きく表示されます。そのままやってみましょう。</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-gray-400 w-6 shrink-0">4.</span>
              <span>「もう一度」ボタンで最初の状態に戻ります。</span>
            </li>
          </ol>
        </section>

        {/* タスク一覧 */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            タスク一覧
          </h2>
          <ul className="flex gap-3 flex-wrap">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
              >
                {task.label}
              </li>
            ))}
          </ul>
        </section>

        {/* コードを見る */}
        <section>
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            コードを見る
          </h2>
          <details className="border border-gray-200 rounded-xl p-4">
            <summary className="text-sm text-gray-500 cursor-pointer select-none">
              tasks.ts / pickRandom.ts のコード
            </summary>
            <div className="mt-4 space-y-4">
              <figure>
                <Image
                  src={IMAGES.codeTask}
                  alt="tasks.tsのコード：タスク一覧の定義"
                  width={800}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
                <figcaption className="text-xs text-gray-400 mt-2">
                  src/data/tasks.ts — タスクの定義
                </figcaption>
              </figure>
              <figure>
                <Image
                  src={IMAGES.codeRandom}
                  alt="pickRandom.tsのコード：ランダム選択ユーティリティ"
                  width={800}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
                <figcaption className="text-xs text-gray-400 mt-2">
                  src/lib/pickRandom.ts — ランダム選択ロジック
                </figcaption>
              </figure>
            </div>
          </details>
        </section>
      </div>
    </main>
  );
}

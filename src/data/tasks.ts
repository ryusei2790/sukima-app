/** タスクの型定義 */
export type Task = {
  /** タスクの一意識別子 */
  id: string;
  /** 画面に表示するタスク名 */
  label: string;
};

/** 抽選対象のタスク一覧（ハードコード） */
export const tasks: Task[] = [
  { id: "read", label: "本を読む" },
  { id: "breath", label: "深呼吸する" },
  { id: "meditate", label: "瞑想する" },
];

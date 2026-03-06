/**
 * 配列からランダムに1件選択して返す。
 * 空配列の場合は null を返す。
 * @param items 選択対象の配列
 * @returns ランダムに選ばれた要素、または null
 */
export function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

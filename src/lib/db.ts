/**
 * db.ts
 * 役割: Prisma Client のシングルトンインスタンスを提供する
 *
 * Prisma 7 の新アーキテクチャについて:
 * Prisma 7 では DATABASE_URL を環境変数から自動読み込みする従来方式は廃止され、
 * Driver Adapter（@prisma/adapter-pg）を経由した接続が必要になった。
 *
 * なぜシングルトンか:
 * Next.js の開発環境では Hot Reload のたびにモジュールが再実行されるため、
 * 何もしないと PrismaClient・PgPool が大量に生成されてDB接続が枯渇する。
 * グローバル変数にキャッシュすることで接続を1つに保つ。
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

/** グローバルキャッシュ用の型拡張（開発環境のHot Reload対策） */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** DATABASE_URL からアダプター経由で Prisma Client を生成する */
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL が環境変数に設定されていません");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

/** Prisma Client シングルトン */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// 開発環境のみグローバルにキャッシュする（本番はモジュールキャッシュで十分）
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

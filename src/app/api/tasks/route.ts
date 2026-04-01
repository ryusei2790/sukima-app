/**
 * GET  /api/tasks  - タスク一覧取得（未認証時はデフォルトタスクを返す）
 * POST /api/tasks  - タスク追加（認証必須）
 *
 * 設計意図:
 * - 未ログインユーザーも使えるよう、GETは認証オプショナルにする
 * - 未ログイン時は tasks.ts のハードコードを返す（既存動作を維持）
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { tasks as defaultTasks } from "@/data/tasks";

/** Cookieからユーザーを取得するヘルパー */
async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.userId ?? null;
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);

  if (!userId) {
    // 未ログイン: デフォルトタスクを返す
    return NextResponse.json(defaultTasks);
  }

  // ログイン済み: ユーザー固有タスクを取得
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { id: true, label: true },
  });

  // タスクが0件の場合もデフォルトを返す（初回ログイン体験向上）
  if (tasks.length === 0) {
    return NextResponse.json(defaultTasks);
  }

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.label !== "string" || body.label.trim() === "") {
    return NextResponse.json(
      { error: "タスク名を入力してください" },
      { status: 400 }
    );
  }

  const task = await prisma.task.create({
    data: { label: body.label.trim(), userId },
    select: { id: true, label: true },
  });

  return NextResponse.json(task, { status: 201 });
}

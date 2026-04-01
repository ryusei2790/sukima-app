/**
 * DELETE /api/tasks/:id
 * 役割: 指定したタスクを削除する（認証必須・自分のタスクのみ削除可）
 *
 * セキュリティ:
 * - userId で where 絞り込みをすることで、他ユーザーのタスクを削除不可にする
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "認証が無効です" }, { status: 401 });
  }

  const { id } = await params;

  // userId で絞ることで自分のタスク以外は削除できない（存在しない扱いになる）
  const deleted = await prisma.task.deleteMany({
    where: { id, userId: payload.userId },
  });

  if (deleted.count === 0) {
    return NextResponse.json(
      { error: "タスクが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "削除しました" });
}

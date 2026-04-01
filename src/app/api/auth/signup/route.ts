/**
 * POST /api/auth/signup
 * 役割: 新規ユーザーをメール/パスワードで登録する
 *
 * 処理フロー:
 * 1. リクエストボディからemail・passwordを受け取る
 * 2. 入力バリデーション（空チェック・メール形式・パスワード長）
 * 3. 既存ユーザーの重複チェック
 * 4. bcryptでパスワードをハッシュ化
 * 5. DBにユーザーを保存
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json(
      { error: "メールアドレスとパスワードを入力してください" },
      { status: 400 }
    );
  }

  const email = body.email.trim().toLowerCase();
  const { password } = body;

  // 最低限のバリデーション
  if (!email.includes("@") || password.length < 8) {
    return NextResponse.json(
      { error: "メールアドレスが不正か、パスワードが8文字未満です" },
      { status: 400 }
    );
  }

  // 重複チェック
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "このメールアドレスはすでに登録されています" },
      { status: 409 }
    );
  }

  // パスワードハッシュ化（コスト係数12: セキュリティと速度のバランス）
  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { email, password: hashed },
  });

  return NextResponse.json({ message: "登録が完了しました" }, { status: 201 });
}

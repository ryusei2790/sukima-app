/**
 * POST /api/auth/login
 * 役割: メール/パスワードを照合し、JWTをHttpOnly Cookieにセットする
 *
 * 処理フロー:
 * 1. リクエストボディからemail・passwordを受け取る
 * 2. DBでユーザーを検索
 * 3. bcryptでパスワード照合
 * 4. 照合成功 → JWTを発行 → HttpOnly Cookieにセット
 *
 * セキュリティ:
 * - ユーザー不在とパスワード不一致を同じエラーメッセージで返す（列挙攻撃対策）
 * - Cookie は httpOnly + sameSite=strict でXSS/CSRF対策
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";

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

  const user = await prisma.user.findUnique({ where: { email } });

  // ユーザー不在時もbcryptを実行してタイミング攻撃を防ぐ
  const dummyHash = "$2b$12$invalidhashfortiminglprotectiononly";
  const isValid = user
    ? await bcrypt.compare(password, user.password)
    : await bcrypt.compare(password, dummyHash).then(() => false);

  if (!isValid) {
    return NextResponse.json(
      { error: "メールアドレスまたはパスワードが正しくありません" },
      { status: 401 }
    );
  }

  const token = await signToken({ userId: user!.id });

  const res = NextResponse.json({ message: "ログインしました" });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7日
    path: "/",
  });

  return res;
}

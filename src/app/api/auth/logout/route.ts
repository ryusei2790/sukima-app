/**
 * POST /api/auth/logout
 * 役割: auth_token Cookie を削除してログアウトする
 */

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "ログアウトしました" });
  res.cookies.set("auth_token", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // 即時削除
    path: "/",
  });
  return res;
}

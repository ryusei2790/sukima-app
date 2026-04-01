/**
 * auth.ts
 * 役割: JWT（JSON Web Token）の発行・検証を担う認証ユーティリティ
 *
 * 設計意図:
 * - jose ライブラリを使用（Web Crypto API ベース、Edge Runtime 対応）
 * - JWTはHttpOnly Cookieに保存するため、JSからは直接アクセス不可
 * - ペイロードにはユーザーIDのみ格納（最小権限の原則）
 */

import { SignJWT, jwtVerify } from "jose";

/** JWT ペイロードの型定義 */
export type JWTPayload = {
  userId: string;
};

/** 環境変数から秘密鍵を取得してUint8Arrayに変換する */
const getSecret = (): Uint8Array => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET が環境変数に設定されていません");
  }
  return new TextEncoder().encode(secret);
};

/**
 * JWTを発行する
 * @param payload - トークンに埋め込むデータ（userId）
 * @returns 署名済みJWT文字列
 */
export const signToken = async (payload: JWTPayload): Promise<string> => {
  return new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7日間有効
    .sign(getSecret());
};

/**
 * JWTを検証してペイロードを返す
 * @param token - 検証するJWT文字列
 * @returns ペイロード、または検証失敗時は null
 */
export const verifyToken = async (
  token: string
): Promise<JWTPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.userId !== "string") return null;
    return { userId: payload.userId };
  } catch {
    // トークンの期限切れ・改ざん・フォーマット不正はすべて null で返す
    return null;
  }
};

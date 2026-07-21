import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import ms from "ms";
import type { AuthRepository, AuthUserRecord } from "../repository/auth.repository";
import { env } from "../config/env";

export function hashRefreshTokenValue(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function signAccessToken(user: { id: string; role: "customer" | "seller" }) {
  return jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function toPublicUser(user: AuthUserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function issueRefreshToken(repository: AuthRepository, userId: string) {
  const refreshTokenValue = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN as ms.StringValue));

  await repository.createRefreshToken({
    userId,
    tokenHash: hashRefreshTokenValue(refreshTokenValue),
    expiresAt,
  });

  return refreshTokenValue;
}

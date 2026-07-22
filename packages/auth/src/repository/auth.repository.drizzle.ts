import { and, eq, isNull } from "drizzle-orm";
import { db, schema } from "@techmart/db";
import type { AuthRepository } from "./auth.repository";

export const drizzleAuthRepository: AuthRepository = {
  findUserByEmail(email) {
    return db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .then(([user]) => user);
  },

  findUserById(id) {
    return db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .then(([user]) => user);
  },

  async createUser(data) {
    const [user] = await db.insert(schema.users).values(data).returning();
    return user;
  },

  async createRefreshToken(data) {
    const [refreshToken] = await db.insert(schema.refreshTokens).values(data).returning();
    return refreshToken;
  },

  findRefreshTokenByHash(tokenHash) {
    return db
      .select()
      .from(schema.refreshTokens)
      .where(eq(schema.refreshTokens.tokenHash, tokenHash))
      .then(([refreshToken]) => refreshToken);
  },

  async revokeRefreshToken(id) {
    await db
      .update(schema.refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(schema.refreshTokens.id, id));
  },

  async revokeAllUserRefreshTokens(userId) {
    await db
      .update(schema.refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(schema.refreshTokens.userId, userId), isNull(schema.refreshTokens.revokedAt)));
  },
};

import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import type {
  AuthRepository,
  AuthUserRecord,
  RefreshTokenRecord,
} from "../../repository/auth.repository";

export function createFakeRepository(): AuthRepository {
  const users = new Map<string, AuthUserRecord>();
  const refreshTokens = new Map<string, RefreshTokenRecord>();

  return {
    async findUserByEmail(email) {
      return [...users.values()].find((user) => user.email === email);
    },
    async findUserById(id) {
      return users.get(id);
    },
    async createUser(data) {
      const user: AuthUserRecord = { id: randomUUID(), createdAt: new Date(), ...data };
      users.set(user.id, user);
      return user;
    },
    async createRefreshToken(data) {
      const refreshToken: RefreshTokenRecord = { id: randomUUID(), revokedAt: null, ...data };
      refreshTokens.set(refreshToken.id, refreshToken);
      return refreshToken;
    },
    async findRefreshTokenByHash(tokenHash) {
      return [...refreshTokens.values()].find((token) => token.tokenHash === tokenHash);
    },
    async revokeRefreshToken(id) {
      const token = refreshTokens.get(id);
      if (token) token.revokedAt = new Date();
    },
    async revokeAllUserRefreshTokens(userId) {
      for (const token of refreshTokens.values()) {
        if (token.userId === userId && !token.revokedAt) token.revokedAt = new Date();
      }
    },
  };
}

export async function seedUser(
  repository: AuthRepository,
  overrides: { email?: string; password?: string; role?: "customer" | "seller" } = {},
) {
  const password = overrides.password ?? "senha-correta";
  const passwordHash = await bcrypt.hash(password, 4);
  const user = await repository.createUser({
    name: "Fulano",
    email: overrides.email ?? "fulano@example.com",
    passwordHash,
    role: overrides.role ?? "customer",
  });
  return { user, password };
}

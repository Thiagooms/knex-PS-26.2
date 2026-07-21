export interface AuthUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "customer" | "seller";
  createdAt: Date;
}

export interface RefreshTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface AuthRepository {
  findUserByEmail(email: string): Promise<AuthUserRecord | undefined>;
  findUserById(id: string): Promise<AuthUserRecord | undefined>;
  createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: "customer" | "seller";
  }): Promise<AuthUserRecord>;
  createRefreshToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<RefreshTokenRecord>;
  findRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenRecord | undefined>;
  revokeRefreshToken(id: string): Promise<void>;
  revokeAllUserRefreshTokens(userId: string): Promise<void>;
}

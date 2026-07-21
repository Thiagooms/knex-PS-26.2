import bcrypt from "bcrypt";
import { AppError } from "@techmart/shared";
import type { LoginInput, RefreshInput, RegisterInput } from "../auth.schema";
import type { AuthRepository } from "../repository/auth.repository";
import { env } from "../config/env";
import { hashRefreshTokenValue, issueRefreshToken, signAccessToken, toPublicUser } from "./auth.tokens";

export function createAuthService(repository: AuthRepository) {
  async function register(input: RegisterInput) {
    const existingUser = await repository.findUserByEmail(input.email);
    if (existingUser) {
      throw new AppError("E-mail já cadastrado.", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_COST);
    const user = await repository.createUser({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });

    return toPublicUser(user);
  }

  async function login(input: LoginInput) {
    const user = await repository.findUserByEmail(input.email);
    const passwordMatches = user ? await bcrypt.compare(input.password, user.passwordHash) : false;

    if (!user || !passwordMatches) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const accessToken = signAccessToken(user);
    const refreshToken = await issueRefreshToken(repository, user.id);

    return { accessToken, refreshToken, user: toPublicUser(user) };
  }

  async function refresh(input: RefreshInput) {
    const tokenHash = hashRefreshTokenValue(input.refreshToken);
    const storedToken = await repository.findRefreshTokenByHash(tokenHash);

    if (!storedToken) {
      throw new AppError("Token de atualização inválido.", 401);
    }

    if (storedToken.revokedAt) {
      await repository.revokeAllUserRefreshTokens(storedToken.userId);
      throw new AppError(
        "Token de atualização inválido. Todas as sessões foram revogadas por segurança.",
        401,
      );
    }

    if (storedToken.expiresAt < new Date()) {
      throw new AppError("Token de atualização expirado.", 401);
    }

    const user = await repository.findUserById(storedToken.userId);
    if (!user) {
      throw new AppError("Token de atualização inválido.", 401);
    }

    await repository.revokeRefreshToken(storedToken.id);

    const accessToken = signAccessToken(user);
    const refreshToken = await issueRefreshToken(repository, user.id);

    return { accessToken, refreshToken };
  }

  return { register, login, refresh };
}

export type AuthService = ReturnType<typeof createAuthService>;

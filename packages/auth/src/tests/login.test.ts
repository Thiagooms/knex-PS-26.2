import { describe, expect, test } from "vitest";
import { createAuthService } from "../service/auth.service";
import { createFakeRepository, seedUser } from "./fixtures/fake-auth.repository";

describe("login", () => {
  test("retorna tokens com credenciais corretas", async () => {
    const repository = createFakeRepository();
    const authService = createAuthService(repository);
    const { password } = await seedUser(repository, { email: "fulano@example.com" });

    const result = await authService.login({ email: "fulano@example.com", password });

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.user.email).toBe("fulano@example.com");
  });

  test("rejeita senha errada com mensagem genérica", async () => {
    const repository = createFakeRepository();
    const authService = createAuthService(repository);
    await seedUser(repository, { email: "fulano@example.com" });

    await expect(
      authService.login({ email: "fulano@example.com", password: "senha-errada" }),
    ).rejects.toMatchObject({ statusCode: 401, message: "E-mail ou senha inválidos." });
  });

  test("rejeita e-mail inexistente com a mesma mensagem genérica", async () => {
    const repository = createFakeRepository();
    const authService = createAuthService(repository);

    await expect(
      authService.login({ email: "ninguem@example.com", password: "qualquer" }),
    ).rejects.toMatchObject({ statusCode: 401, message: "E-mail ou senha inválidos." });
  });
});

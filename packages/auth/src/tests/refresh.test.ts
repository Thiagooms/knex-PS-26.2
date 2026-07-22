import { describe, expect, test } from "vitest";
import { createAuthService } from "../service/auth.service";
import { createFakeRepository, seedUser } from "./fixtures/fake-auth.repository";

describe("refresh", () => {
  test("rotaciona o token: emite um novo e invalida o antigo", async () => {
    const repository = createFakeRepository();
    const authService = createAuthService(repository);
    const { password } = await seedUser(repository, { email: "fulano@example.com" });
    const { refreshToken } = await authService.login({ email: "fulano@example.com", password });

    const rotated = await authService.refresh({ refreshToken });

    expect(rotated.refreshToken).not.toBe(refreshToken);
    await expect(authService.refresh({ refreshToken })).rejects.toMatchObject({ statusCode: 401 });
  });

  test("reuso de token já rotacionado revoga todas as sessões do usuário", async () => {
    const repository = createFakeRepository();
    const authService = createAuthService(repository);
    const { password } = await seedUser(repository, { email: "fulano@example.com" });
    const { refreshToken: firstToken } = await authService.login({
      email: "fulano@example.com",
      password,
    });
    const { refreshToken: secondToken } = await authService.refresh({ refreshToken: firstToken });

    await expect(authService.refresh({ refreshToken: firstToken })).rejects.toMatchObject({
      statusCode: 401,
    });
    await expect(authService.refresh({ refreshToken: secondToken })).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  test("rejeita token desconhecido", async () => {
    const repository = createFakeRepository();
    const authService = createAuthService(repository);

    await expect(
      authService.refresh({ refreshToken: "token-que-nunca-existiu" }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});

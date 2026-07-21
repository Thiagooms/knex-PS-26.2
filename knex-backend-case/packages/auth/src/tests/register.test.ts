import bcrypt from "bcrypt";
import { describe, expect, test } from "vitest";
import { createAuthService } from "../service/auth.service";
import { createFakeRepository, seedUser } from "./fixtures/fake-auth.repository";

describe("register", () => {
  test("cria usuário com senha hasheada e nunca devolve o hash", async () => {
    const repository = createFakeRepository();
    const authService = createAuthService(repository);

    const result = await authService.register({
      name: "Fulano",
      email: "fulano@example.com",
      password: "senha-correta",
      role: "customer",
    });

    expect(result).not.toHaveProperty("passwordHash");
    expect(result.email).toBe("fulano@example.com");

    const stored = await repository.findUserByEmail("fulano@example.com");
    expect(stored?.passwordHash).not.toBe("senha-correta");
    expect(await bcrypt.compare("senha-correta", stored!.passwordHash)).toBe(true);
  });

  test("rejeita e-mail já cadastrado", async () => {
    const repository = createFakeRepository();
    const authService = createAuthService(repository);
    await seedUser(repository, { email: "fulano@example.com" });

    await expect(
      authService.register({
        name: "Outro",
        email: "fulano@example.com",
        password: "outrasenha",
        role: "seller",
      }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });
});

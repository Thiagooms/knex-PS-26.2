import { randomUUID } from "node:crypto";
import { describe, expect, test } from "vitest";
import { createProductsService } from "../service/products.service";
import { createFakeProductsRepository, seedProduct } from "./fixtures/fake-products.repository";

describe("update", () => {
  test("atualiza apenas os campos informados", async () => {
    const repository = createFakeProductsRepository();
    const service = createProductsService(repository);
    const seeded = await seedProduct(repository, { name: "Nome Antigo", stock: 10 });

    const updated = await service.update(seeded.id, { name: "Nome Novo", price: 299.9 });

    expect(updated.name).toBe("Nome Novo");
    expect(updated.price).toBe("299.90");
    expect(updated.stock).toBe(10);
  });

  test("preserva alreadySold ao editar (a flag nunca vem do input)", async () => {
    const repository = createFakeProductsRepository();
    const service = createProductsService(repository);
    const seeded = await seedProduct(repository, { sold: true });

    const updated = await service.update(seeded.id, { name: "Editado" });

    expect(updated.alreadySold).toBe(true);
  });

  test("lança 404 quando o produto não existe", async () => {
    const repository = createFakeProductsRepository();
    const service = createProductsService(repository);

    await expect(service.update(randomUUID(), { name: "Qualquer" })).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

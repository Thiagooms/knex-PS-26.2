import { randomUUID } from "node:crypto";
import { describe, expect, test } from "vitest";
import { createProductsService } from "../service/products.service";
import { createFakeProductsRepository, seedProduct } from "./fixtures/fake-products.repository";

describe("remove", () => {
  test("exclui produto que ainda não foi vendido", async () => {
    const repository = createFakeProductsRepository();
    const service = createProductsService(repository);
    const seeded = await seedProduct(repository);

    await service.remove(seeded.id);

    expect(await repository.findById(seeded.id)).toBeUndefined();
  });

  test("lança 404 quando o produto não existe", async () => {
    const repository = createFakeProductsRepository();
    const service = createProductsService(repository);

    await expect(service.remove(randomUUID())).rejects.toMatchObject({ statusCode: 404 });
  });

  test("rejeita exclusão de produto já vendido e o mantém no acervo", async () => {
    const repository = createFakeProductsRepository();
    const service = createProductsService(repository);
    const seeded = await seedProduct(repository, { sold: true });

    await expect(service.remove(seeded.id)).rejects.toMatchObject({ statusCode: 409 });
    expect(await repository.findById(seeded.id)).toBeDefined();
  });
});

import { randomUUID } from "node:crypto";
import { describe, expect, test } from "vitest";
import { createProductsService } from "../service/products.service";
import { createFakeProductsRepository, seedProduct } from "./fixtures/fake-products.repository";

describe("list", () => {
  test("retorna todos os produtos cadastrados", async () => {
    const repository = createFakeProductsRepository();
    const service = createProductsService(repository);
    await seedProduct(repository, { name: "Produto A" });
    await seedProduct(repository, { name: "Produto B" });

    const products = await service.list();

    expect(products).toHaveLength(2);
  });

  test("retorna lista vazia quando não há produtos", async () => {
    const repository = createFakeProductsRepository();
    const service = createProductsService(repository);

    expect(await service.list()).toEqual([]);
  });
});

describe("getById", () => {
  test("retorna o produto quando existe", async () => {
    const repository = createFakeProductsRepository();
    const service = createProductsService(repository);
    const seeded = await seedProduct(repository);

    const product = await service.getById(seeded.id);

    expect(product.id).toBe(seeded.id);
  });

  test("lança 404 quando o produto não existe", async () => {
    const repository = createFakeProductsRepository();
    const service = createProductsService(repository);

    await expect(service.getById(randomUUID())).rejects.toMatchObject({ statusCode: 404 });
  });
});

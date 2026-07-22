import { describe, expect, test } from "vitest";
import { createProductsService } from "../service/products.service";
import { createFakeProductsRepository } from "./fixtures/fake-products.repository";

describe("create", () => {
  test("cria produto com preço formatado e alreadySold=false", async () => {
    const repository = createFakeProductsRepository();
    const service = createProductsService(repository);

    const product = await service.create({
      name: "Mouse Gamer",
      description: "6 botões, 16000 DPI",
      price: 149.9,
      stock: 5,
    });

    expect(product.id).toEqual(expect.any(String));
    expect(product.price).toBe("149.90");
    expect(product.stock).toBe(5);
    expect(product.alreadySold).toBe(false);
  });

  test("formata preço inteiro com duas casas decimais", async () => {
    const repository = createFakeProductsRepository();
    const service = createProductsService(repository);

    const product = await service.create({
      name: "Cabo HDMI",
      description: "2 metros, 4K",
      price: 30,
      stock: 100,
    });

    expect(product.price).toBe("30.00");
  });
});

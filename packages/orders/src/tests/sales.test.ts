import { randomUUID } from "node:crypto";
import { describe, expect, test } from "vitest";
import { buildOrdersService } from "./fixtures/fake-orders.repository";
import { seedProduct } from "./fixtures/fake-products.repository";

describe("getSalesByProduct", () => {
  test("agrega quantidade vendida e receita de um produto", async () => {
    const { service, productsRepository } = buildOrdersService();
    const product = await seedProduct(productsRepository, { price: "100.00", stock: 100 });

    await service.create("customer-1", { items: [{ productId: product.id, quantity: 2 }] });
    await service.create("customer-2", { items: [{ productId: product.id, quantity: 3 }] });

    const summary = await service.getSalesByProduct(product.id);

    expect(summary).toEqual({ productId: product.id, quantitySold: 5, revenue: "500.00" });
  });

  test("retorna mensagem informativa para produto nunca vendido", async () => {
    const { service, productsRepository } = buildOrdersService();
    const product = await seedProduct(productsRepository, { stock: 10 });

    const result = await service.getSalesByProduct(product.id);

    expect(result).toHaveProperty("message");
    expect(result).not.toHaveProperty("quantitySold");
  });

  test("produto inexistente também cai na mensagem informativa", async () => {
    const { service } = buildOrdersService();

    const result = await service.getSalesByProduct(randomUUID());

    expect(result).toHaveProperty("message");
  });
});

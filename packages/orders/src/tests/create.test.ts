import { randomUUID } from "node:crypto";
import { describe, expect, test } from "vitest";
import { buildOrdersService } from "./fixtures/fake-orders.repository";
import { seedProduct } from "./fixtures/fake-products.repository";

describe("create order", () => {
  test("cria pedido, decrementa estoque, congela preço e marca alreadySold", async () => {
    const { service, productsRepository } = buildOrdersService();
    const product = await seedProduct(productsRepository, { price: "100.00", stock: 5 });

    const order = await service.create("customer-1", {
      items: [{ productId: product.id, quantity: 2 }],
    });

    expect(order.totalAmount).toBe("200.00");
    expect(order.items).toEqual([{ productId: product.id, quantity: 2, unitPrice: "100.00" }]);

    const updated = await productsRepository.findById(product.id);
    expect(updated?.stock).toBe(3);
    expect(updated?.alreadySold).toBe(true);
  });

  test("soma o total de múltiplos itens", async () => {
    const { service, productsRepository } = buildOrdersService();
    const a = await seedProduct(productsRepository, { price: "100.00", stock: 5 });
    const b = await seedProduct(productsRepository, { price: "50.00", stock: 5 });

    const order = await service.create("customer-1", {
      items: [
        { productId: a.id, quantity: 1 },
        { productId: b.id, quantity: 2 },
      ],
    });

    expect(order.totalAmount).toBe("200.00");
  });

  test("faz merge de productId repetido no mesmo pedido", async () => {
    const { service, productsRepository } = buildOrdersService();
    const product = await seedProduct(productsRepository, { price: "10.00", stock: 5 });

    const order = await service.create("customer-1", {
      items: [
        { productId: product.id, quantity: 1 },
        { productId: product.id, quantity: 2 },
      ],
    });

    expect(order.items).toHaveLength(1);
    expect(order.items[0]).toMatchObject({ quantity: 3 });
    expect((await productsRepository.findById(product.id))?.stock).toBe(2);
  });

  test("rejeita produto inexistente com 404", async () => {
    const { service } = buildOrdersService();

    await expect(
      service.create("customer-1", { items: [{ productId: randomUUID(), quantity: 1 }] }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  test("rejeita estoque insuficiente com 409", async () => {
    const { service, productsRepository } = buildOrdersService();
    const product = await seedProduct(productsRepository, { stock: 2 });

    await expect(
      service.create("customer-1", { items: [{ productId: product.id, quantity: 5 }] }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });
});

import { describe, expect, test } from "vitest";
import { buildOrdersService } from "./fixtures/fake-orders.repository";
import { seedProduct } from "./fixtures/fake-products.repository";

describe("listByCustomer", () => {
  test("retorna apenas os pedidos do cliente autenticado, com itens", async () => {
    const { service, productsRepository } = buildOrdersService();
    const product = await seedProduct(productsRepository, { price: "10.00", stock: 100 });

    await service.create("customer-1", { items: [{ productId: product.id, quantity: 1 }] });
    await service.create("customer-2", { items: [{ productId: product.id, quantity: 1 }] });

    const orders = await service.listByCustomer("customer-1");

    expect(orders).toHaveLength(1);
    expect(orders[0].customerId).toBe("customer-1");
    expect(orders[0].items).toHaveLength(1);
  });
});

describe("listAllSales", () => {
  test("retorna todos os pedidos da loja com seus itens", async () => {
    const { service, productsRepository } = buildOrdersService();
    const product = await seedProduct(productsRepository, { price: "10.00", stock: 100 });

    await service.create("customer-1", { items: [{ productId: product.id, quantity: 1 }] });
    await service.create("customer-2", { items: [{ productId: product.id, quantity: 1 }] });

    const sales = await service.listAllSales();

    expect(sales).toHaveLength(2);
    expect(sales.every((order) => order.items.length === 1)).toBe(true);
  });
});

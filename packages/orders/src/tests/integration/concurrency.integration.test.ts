import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { db, pool, schema } from "@techmart/db";
import { drizzleProductsRepository } from "@techmart/products";
import { createOrdersService } from "../../service/orders.service";
import { drizzleOrdersRepository } from "../../repository/orders.repository.drizzle";

const ordersService = createOrdersService(
  drizzleOrdersRepository,
  drizzleProductsRepository,
  (fn) => db.transaction(fn),
);

describe("concorrência: proteção contra overselling", () => {
  const INITIAL_STOCK = 5;
  const CONCURRENT_BUYERS = 20;
  let customerId: string;
  let productId: string;

  beforeAll(async () => {
    const [customer] = await db
      .insert(schema.users)
      .values({
        name: "Cliente Concorrência",
        email: `concorrencia-${randomUUID()}@example.com`,
        passwordHash: "hash-de-teste",
        role: "customer",
      })
      .returning();
    customerId = customer.id;

    const [product] = await db
      .insert(schema.products)
      .values({
        name: "Produto Concorrência",
        description: "Produto para teste de concorrência",
        price: "10.00",
        stock: INITIAL_STOCK,
      })
      .returning();
    productId = product.id;
  });

  afterAll(async () => {
    await db.delete(schema.orderItems).where(eq(schema.orderItems.productId, productId));
    await db.delete(schema.orders).where(eq(schema.orders.customerId, customerId));
    await db.delete(schema.products).where(eq(schema.products.id, productId));
    await db.delete(schema.users).where(eq(schema.users.id, customerId));
    await pool.end();
  });

  test(`${CONCURRENT_BUYERS} compras simultâneas de 1 unidade num estoque de ${INITIAL_STOCK}: só ${INITIAL_STOCK} passam e o estoque nunca fica negativo`, async () => {
    const attempts = Array.from({ length: CONCURRENT_BUYERS }, () =>
      ordersService.create(customerId, { items: [{ productId, quantity: 1 }] }),
    );

    const results = await Promise.allSettled(attempts);
    const fulfilled = results.filter((result) => result.status === "fulfilled").length;
    const rejected = results.filter((result) => result.status === "rejected").length;

    expect(fulfilled).toBe(INITIAL_STOCK);
    expect(rejected).toBe(CONCURRENT_BUYERS - INITIAL_STOCK);

    const [product] = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, productId));
    expect(product.stock).toBe(0);
  });
});

import { and, eq, gte, sql } from "drizzle-orm";
import { db, schema } from "@techmart/db";
import type { ProductsRepository } from "./products.repository";

export const drizzleProductsRepository: ProductsRepository = {
  async findAll() {
    return db.select().from(schema.products).orderBy(schema.products.createdAt);
  },

  findById(id) {
    return db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, id))
      .then(([product]) => product);
  },

  async create(data) {
    const [product] = await db.insert(schema.products).values(data).returning();
    return product;
  },

  async update(id, data) {
    const [product] = await db
      .update(schema.products)
      .set(data)
      .where(eq(schema.products.id, id))
      .returning();
    return product;
  },

  async deleteIfNotSold(id) {
    const deleted = await db
      .delete(schema.products)
      .where(and(eq(schema.products.id, id), eq(schema.products.alreadySold, false)))
      .returning({ id: schema.products.id });
    return deleted.length > 0;
  },

  async decrementStock(tx, productId, quantity) {
    const [product] = await tx
      .update(schema.products)
      .set({
        stock: sql`${schema.products.stock} - ${quantity}`,
        alreadySold: true,
      })
      .where(and(eq(schema.products.id, productId), gte(schema.products.stock, quantity)))
      .returning();
    return product;
  },
};

import { desc, eq, inArray, sql } from "drizzle-orm";
import { db, schema } from "@techmart/db";
import type {
  OrderRecord,
  OrderWithItems,
  OrdersRepository,
  ProductSalesSummary,
} from "./orders.repository";

async function attachItems(orderRows: OrderRecord[]): Promise<OrderWithItems[]> {
  if (orderRows.length === 0) return [];

  const items = await db
    .select()
    .from(schema.orderItems)
    .where(
      inArray(
        schema.orderItems.orderId,
        orderRows.map((order) => order.id),
      ),
    );

  return orderRows.map((order) => ({
    ...order,
    items: items.filter((item) => item.orderId === order.id),
  }));
}

export const drizzleOrdersRepository: OrdersRepository = {
  async createOrder(tx, data) {
    const [order] = await tx.insert(schema.orders).values(data).returning();
    return order;
  },

  async createOrderItems(tx, items) {
    await tx.insert(schema.orderItems).values(items);
  },

  async findByCustomer(customerId) {
    const orderRows = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.customerId, customerId))
      .orderBy(desc(schema.orders.createdAt));
    return attachItems(orderRows);
  },

  async findAll() {
    const orderRows = await db
      .select()
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt));
    return attachItems(orderRows);
  },

  async getProductSalesSummary(productId) {
    const [row] = await db
      .select({
        quantitySold: sql<string>`coalesce(sum(${schema.orderItems.quantity}), 0)`,
        revenue: sql<string>`coalesce(sum(${schema.orderItems.quantity} * ${schema.orderItems.unitPrice}), 0)`,
      })
      .from(schema.orderItems)
      .where(eq(schema.orderItems.productId, productId));

    return {
      productId,
      quantitySold: Number(row?.quantitySold ?? 0),
      revenue: String(row?.revenue ?? "0"),
    };
  },
};

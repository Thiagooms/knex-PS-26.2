import { randomUUID } from "node:crypto";
import type { Transaction } from "@techmart/db";
import { createOrdersService } from "../../service/orders.service";
import type {
  OrderItemRecord,
  OrderRecord,
  OrdersRepository,
} from "../../repository/orders.repository";
import { createFakeProductsRepository } from "./fake-products.repository";

const FAKE_TX = {} as unknown as Transaction;

export function createFakeOrdersRepository(): OrdersRepository {
  const orders = new Map<string, OrderRecord>();
  const items: OrderItemRecord[] = [];

  return {
    async createOrder(_tx, data) {
      const order: OrderRecord = { id: randomUUID(), createdAt: new Date(), ...data };
      orders.set(order.id, order);
      return order;
    },
    async createOrderItems(_tx, newItems) {
      for (const item of newItems) {
        items.push({ id: randomUUID(), ...item });
      }
    },
    async findByCustomer(customerId) {
      return [...orders.values()]
        .filter((order) => order.customerId === customerId)
        .map((order) => ({ ...order, items: items.filter((item) => item.orderId === order.id) }));
    },
    async findAll() {
      return [...orders.values()].map((order) => ({
        ...order,
        items: items.filter((item) => item.orderId === order.id),
      }));
    },
    async getProductSalesSummary(productId) {
      const productItems = items.filter((item) => item.productId === productId);
      const quantitySold = productItems.reduce((sum, item) => sum + item.quantity, 0);
      const revenueCents = productItems.reduce(
        (sum, item) => sum + Math.round(Number(item.unitPrice) * 100) * item.quantity,
        0,
      );
      return { productId, quantitySold, revenue: (revenueCents / 100).toFixed(2) };
    },
  };
}

export function buildOrdersService() {
  const ordersRepository = createFakeOrdersRepository();
  const productsRepository = createFakeProductsRepository();
  const service = createOrdersService(ordersRepository, productsRepository, (fn) => fn(FAKE_TX));
  return { service, ordersRepository, productsRepository };
}

import { AppError, InsufficientStockError } from "@techmart/shared";
import type { Transaction } from "@techmart/db";
import type { ProductsRepository } from "@techmart/products";
import type { CreateOrderInput } from "../orders.schema";
import type { OrdersRepository } from "../repository/orders.repository";

type TransactionRunner = <T>(fn: (tx: Transaction) => Promise<T>) => Promise<T>;

function mergeItems(items: CreateOrderInput["items"]) {
  const quantities = new Map<string, number>();
  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }
  return [...quantities.entries()]
    .map(([productId, quantity]) => ({ productId, quantity }))
    .sort((a, b) => a.productId.localeCompare(b.productId));
}

export function createOrdersService(
  ordersRepository: OrdersRepository,
  productsRepository: ProductsRepository,
  runInTransaction: TransactionRunner,
) {
  async function create(customerId: string, input: CreateOrderInput) {
    const items = mergeItems(input.items);

    for (const item of items) {
      const existing = await productsRepository.findById(item.productId);
      if (!existing) {
        throw new AppError(`Produto ${item.productId} não encontrado.`, 404);
      }
    }

    return runInTransaction(async (tx) => {
      const lines: { productId: string; quantity: number; unitPrice: string }[] = [];
      let totalCents = 0;

      for (const item of items) {
        const product = await productsRepository.decrementStock(tx, item.productId, item.quantity);
        if (!product) {
          throw new InsufficientStockError(item.productId);
        }

        totalCents += Math.round(Number(product.price) * 100) * item.quantity;
        lines.push({ productId: product.id, quantity: item.quantity, unitPrice: product.price });
      }

      const totalAmount = (totalCents / 100).toFixed(2);
      const order = await ordersRepository.createOrder(tx, { customerId, totalAmount });
      await ordersRepository.createOrderItems(
        tx,
        lines.map((line) => ({ orderId: order.id, ...line })),
      );

      return { ...order, items: lines };
    });
  }

  async function listByCustomer(customerId: string) {
    return ordersRepository.findByCustomer(customerId);
  }

  async function listAllSales() {
    return ordersRepository.findAll();
  }

  async function getSalesByProduct(productId: string) {
    const summary = await ordersRepository.getProductSalesSummary(productId);
    if (summary.quantitySold === 0) {
      return { productId, message: "Este produto ainda não foi vendido." };
    }
    return summary;
  }

  return { create, listByCustomer, listAllSales, getSalesByProduct };
}

export type OrdersService = ReturnType<typeof createOrdersService>;

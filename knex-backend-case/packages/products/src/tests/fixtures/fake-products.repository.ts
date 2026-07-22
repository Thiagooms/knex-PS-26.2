import { randomUUID } from "node:crypto";
import type { Transaction } from "@techmart/db";
import type { ProductRecord, ProductsRepository } from "../../repository/products.repository";

const IGNORED_TX = {} as unknown as Transaction;

export function createFakeProductsRepository(): ProductsRepository {
  const products = new Map<string, ProductRecord>();

  return {
    async findAll() {
      return [...products.values()].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    },
    async findById(id) {
      return products.get(id);
    },
    async create(data) {
      const now = new Date();
      const product: ProductRecord = {
        id: randomUUID(),
        alreadySold: false,
        createdAt: now,
        updatedAt: now,
        ...data,
      };
      products.set(product.id, product);
      return product;
    },
    async update(id, data) {
      const product = products.get(id);
      if (!product) return undefined;
      const updated: ProductRecord = { ...product, ...data, updatedAt: new Date() };
      products.set(id, updated);
      return updated;
    },
    async deleteIfNotSold(id) {
      const product = products.get(id);
      if (!product || product.alreadySold) return false;
      products.delete(id);
      return true;
    },
    async decrementStock(_tx, productId, quantity) {
      const product = products.get(productId);
      if (!product || product.stock < quantity) return undefined;
      const updated: ProductRecord = {
        ...product,
        stock: product.stock - quantity,
        alreadySold: true,
        updatedAt: new Date(),
      };
      products.set(productId, updated);
      return updated;
    },
  };
}

export async function seedProduct(
  repository: ProductsRepository,
  overrides: {
    name?: string;
    description?: string;
    price?: string;
    stock?: number;
    sold?: boolean;
  } = {},
): Promise<ProductRecord> {
  const product = await repository.create({
    name: overrides.name ?? "Teclado Mecânico",
    description: overrides.description ?? "Switch marrom, layout ABNT2",
    price: overrides.price ?? "199.90",
    stock: overrides.stock ?? 10,
  });

  if (overrides.sold) {
    const sold = await repository.decrementStock(IGNORED_TX, product.id, 1);
    return sold ?? product;
  }

  return product;
}

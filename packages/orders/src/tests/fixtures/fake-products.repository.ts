import { randomUUID } from "node:crypto";
import type { ProductRecord, ProductsRepository } from "@techmart/products";

export function createFakeProductsRepository(): ProductsRepository {
  const products = new Map<string, ProductRecord>();

  return {
    async findAll() {
      return [...products.values()];
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
        category: data.category ?? "others",
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
  overrides: { price?: string; stock?: number } = {},
) {
  return repository.create({
    name: "Produto",
    description: "Descrição do produto",
    price: overrides.price ?? "100.00",
    stock: overrides.stock ?? 10,
  });
}

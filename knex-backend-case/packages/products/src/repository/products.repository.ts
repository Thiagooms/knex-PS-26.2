import type { Transaction } from "@techmart/db";

export interface ProductRecord {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  alreadySold: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductsRepository {
  findAll(): Promise<ProductRecord[]>;
  findById(id: string): Promise<ProductRecord | undefined>;
  create(data: {
    name: string;
    description: string;
    price: string;
    stock: number;
  }): Promise<ProductRecord>;
  update(
    id: string,
    data: Partial<{ name: string; description: string; price: string; stock: number }>,
  ): Promise<ProductRecord | undefined>;
  deleteIfNotSold(id: string): Promise<boolean>;
  decrementStock(
    tx: Transaction,
    productId: string,
    quantity: number,
  ): Promise<ProductRecord | undefined>;
}

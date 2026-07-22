import { AppError, ProductAlreadySoldError } from "@techmart/shared";
import type { CreateProductInput, UpdateProductInput } from "../products.schema";
import type { ProductsRepository } from "../repository/products.repository";

export function createProductsService(repository: ProductsRepository) {
  async function list() {
    return repository.findAll();
  }

  async function getById(id: string) {
    const product = await repository.findById(id);
    if (!product) {
      throw new AppError("Produto não encontrado.", 404);
    }
    return product;
  }

  async function create(input: CreateProductInput) {
    return repository.create({
      name: input.name,
      description: input.description,
      price: input.price.toFixed(2),
      stock: input.stock,
      category: input.category,
    });
  }

  async function update(id: string, input: UpdateProductInput) {
    const data: Partial<{
      name: string;
      description: string;
      price: string;
      stock: number;
      category: UpdateProductInput["category"];
    }> = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.price !== undefined) data.price = input.price.toFixed(2);
    if (input.stock !== undefined) data.stock = input.stock;
    if (input.category !== undefined) data.category = input.category;

    const product = await repository.update(id, data);
    if (!product) {
      throw new AppError("Produto não encontrado.", 404);
    }
    return product;
  }

  async function remove(id: string) {
    const product = await repository.findById(id);
    if (!product) {
      throw new AppError("Produto não encontrado.", 404);
    }
    const deleted = await repository.deleteIfNotSold(id);
    if (!deleted) {
      throw new ProductAlreadySoldError(id);
    }
  }

  return { list, getById, create, update, remove };
}

export type ProductsService = ReturnType<typeof createProductsService>;

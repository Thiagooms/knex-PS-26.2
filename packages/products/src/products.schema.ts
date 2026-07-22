import { PRODUCT_CATEGORIES } from "@techmart/db";
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  description: z.string().min(1, "Descrição é obrigatória."),
  price: z.number().positive("Preço deve ser maior que zero."),
  stock: z
    .number()
    .int("Estoque deve ser um número inteiro.")
    .min(0, "Estoque não pode ser negativo.")
    .default(0),
  category: z.enum(PRODUCT_CATEGORIES).optional(),
});

export const updateProductSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
    description: z.string().min(1, "Descrição é obrigatória."),
    price: z.number().positive("Preço deve ser maior que zero."),
    stock: z.number().int("Estoque deve ser um número inteiro.").min(0, "Estoque não pode ser negativo."),
    category: z.enum(PRODUCT_CATEGORIES),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });

export const productIdParamsSchema = z.object({
  id: z.uuid("ID de produto inválido."),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

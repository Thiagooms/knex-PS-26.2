import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.uuid("ID de produto inválido."),
        quantity: z
          .number()
          .int("Quantidade deve ser um número inteiro.")
          .positive("Quantidade deve ser maior que zero."),
      }),
    )
    .min(1, "O pedido deve ter ao menos um item."),
});

export const sellerSalesParamsSchema = z.object({
  product_id: z.uuid("ID de produto inválido."),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z.email("E-mail inválido."),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres."),
  role: z.enum(["customer", "seller"], "Papel deve ser 'customer' ou 'seller'."),
});

export const loginSchema = z.object({
  email: z.email("E-mail inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token é obrigatório."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;

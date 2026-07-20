import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string().min(32, "JWT_SECRET deve ter pelo menos 32 caracteres"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("2h"),
});

export const env = envSchema.parse(process.env);

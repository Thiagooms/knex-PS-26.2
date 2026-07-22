import { Router } from "express";
import { validate } from "@techmart/shared";
import type { AuthService } from "../service/auth.service";
import { loginSchema, refreshSchema, registerSchema } from "../auth.schema";
import { createAuthController } from "./auth.controller";

export function createAuthRouter(authService: AuthService) {
  const { registerController, loginController, refreshController } = createAuthController(authService);
  const router = Router();

  router.post("/register", validate(registerSchema), registerController);
  router.post("/login", validate(loginSchema), loginController);
  router.post("/refresh", validate(refreshSchema), refreshController);

  return router;
}

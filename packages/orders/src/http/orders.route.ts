import { Router } from "express";
import { validate } from "@techmart/shared";
import { requireAuth, requireRole } from "@techmart/auth";
import type { OrdersService } from "../service/orders.service";
import { createOrderSchema } from "../orders.schema";
import { createOrdersController } from "./orders.controller";

export function createOrdersRouter(ordersService: OrdersService) {
  const { create, listMine } = createOrdersController(ordersService);
  const router = Router();

  router.post("/", requireAuth, requireRole("customer"), validate(createOrderSchema), create);
  router.get("/", requireAuth, requireRole("customer"), listMine);

  return router;
}

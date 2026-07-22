import { Router } from "express";
import { validate } from "@techmart/shared";
import { requireAuth, requireRole } from "@techmart/auth";
import type { OrdersService } from "../service/orders.service";
import { sellerSalesParamsSchema } from "../orders.schema";
import { createSellerController } from "./seller.controller";

export function createSellerRouter(ordersService: OrdersService) {
  const { listAllSales, salesByProduct } = createSellerController(ordersService);
  const router = Router();

  router.get("/sales", requireAuth, requireRole("seller"), listAllSales);
  router.get(
    "/sales/:product_id",
    requireAuth,
    requireRole("seller"),
    validate(sellerSalesParamsSchema, "params"),
    salesByProduct,
  );

  return router;
}

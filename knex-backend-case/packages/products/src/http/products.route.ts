import { Router } from "express";
import { validate } from "@techmart/shared";
import { requireAuth, requireRole } from "@techmart/auth";
import type { ProductsService } from "../service/products.service";
import { createProductSchema, productIdParamsSchema, updateProductSchema } from "../products.schema";
import { createProductsController } from "./products.controller";

export function createProductsRouter(productsService: ProductsService) {
  const { list, getById, create, update, remove } = createProductsController(productsService);
  const router = Router();

  router.get("/", requireAuth, list);
  router.get("/:id", requireAuth, validate(productIdParamsSchema, "params"), getById);
  router.post("/", requireAuth, requireRole("seller"), validate(createProductSchema), create);
  router.put(
    "/:id",
    requireAuth,
    requireRole("seller"),
    validate(productIdParamsSchema, "params"),
    validate(updateProductSchema),
    update,
  );
  router.delete(
    "/:id",
    requireAuth,
    requireRole("seller"),
    validate(productIdParamsSchema, "params"),
    remove,
  );

  return router;
}

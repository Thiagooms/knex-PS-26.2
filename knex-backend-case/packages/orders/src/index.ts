import { db } from "@techmart/db";
import { drizzleProductsRepository } from "@techmart/products";
import { createOrdersService } from "./service/orders.service";
import { drizzleOrdersRepository } from "./repository/orders.repository.drizzle";
import { createOrdersRouter } from "./http/orders.route";
import { createSellerRouter } from "./http/seller.route";

const ordersService = createOrdersService(
  drizzleOrdersRepository,
  drizzleProductsRepository,
  (fn) => db.transaction(fn),
);

export const ordersRouter = createOrdersRouter(ordersService);
export const sellerRouter = createSellerRouter(ordersService);

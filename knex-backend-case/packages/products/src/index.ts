import { createProductsService } from "./service/products.service";
import { drizzleProductsRepository } from "./repository/products.repository.drizzle";
import { createProductsRouter } from "./http/products.route";

const productsService = createProductsService(drizzleProductsRepository);

export const productsRouter = createProductsRouter(productsService);
export { drizzleProductsRepository } from "./repository/products.repository.drizzle";
export type { ProductsRepository, ProductRecord } from "./repository/products.repository";

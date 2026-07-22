import { sql } from "drizzle-orm";
import { boolean, check, integer, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const PRODUCT_CATEGORIES = [
  "electronics",
  "computers",
  "phones",
  "accessories",
  "gaming",
  "home",
  "others",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const categoryEnum = pgEnum("category", PRODUCT_CATEGORIES);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    stock: integer("stock").notNull().default(0),
    category: categoryEnum("category").notNull().default("others"),
    alreadySold: boolean("already_sold").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [check("products_stock_non_negative", sql`${table.stock} >= 0`)],
);

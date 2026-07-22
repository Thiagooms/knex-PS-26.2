import cors from "cors";
import express from "express";
import { authRouter } from "@techmart/auth";
import { ordersRouter, sellerRouter } from "@techmart/orders";
import { productsRouter } from "@techmart/products";
import { errorHandler } from "@techmart/shared";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/seller", sellerRouter);

app.use(errorHandler);

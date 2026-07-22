import fs from "node:fs";
import path from "node:path";
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

const webDistDir = path.resolve(__dirname, "../../web/dist");

if (fs.existsSync(webDistDir)) {
  app.use(express.static(webDistDir));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(webDistDir, "index.html"));
  });
}

app.use(errorHandler);

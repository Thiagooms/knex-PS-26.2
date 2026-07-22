import type { Request, Response } from "express";
import type { OrdersService } from "../service/orders.service";

export function createSellerController(ordersService: OrdersService) {
  async function listAllSales(_req: Request, res: Response) {
    const sales = await ordersService.listAllSales();
    res.status(200).json({ sales });
  }

  async function salesByProduct(req: Request<{ product_id: string }>, res: Response) {
    const result = await ordersService.getSalesByProduct(req.params.product_id);
    res.status(200).json(result);
  }

  return { listAllSales, salesByProduct };
}

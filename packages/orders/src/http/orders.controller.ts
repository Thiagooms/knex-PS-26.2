import type { Request, Response } from "express";
import type { OrdersService } from "../service/orders.service";

export function createOrdersController(ordersService: OrdersService) {
  async function create(req: Request, res: Response) {
    const order = await ordersService.create(req.user!.id, req.body);
    res.status(201).json({ order });
  }

  async function listMine(req: Request, res: Response) {
    const orders = await ordersService.listByCustomer(req.user!.id);
    res.status(200).json({ orders });
  }

  return { create, listMine };
}

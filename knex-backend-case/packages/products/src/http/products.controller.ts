import type { Request, Response } from "express";
import type { ProductsService } from "../service/products.service";

type IdParams = { id: string };

export function createProductsController(productsService: ProductsService) {
  async function list(_req: Request, res: Response) {
    const products = await productsService.list();
    res.status(200).json({ products });
  }

  async function getById(req: Request<IdParams>, res: Response) {
    const product = await productsService.getById(req.params.id);
    res.status(200).json({ product });
  }

  async function create(req: Request, res: Response) {
    const product = await productsService.create(req.body);
    res.status(201).json({ product });
  }

  async function update(req: Request<IdParams>, res: Response) {
    const product = await productsService.update(req.params.id, req.body);
    res.status(200).json({ product });
  }

  async function remove(req: Request<IdParams>, res: Response) {
    await productsService.remove(req.params.id);
    res.status(204).send();
  }

  return { list, getById, create, update, remove };
}

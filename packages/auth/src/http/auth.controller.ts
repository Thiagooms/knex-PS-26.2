import type { Request, Response } from "express";
import type { AuthService } from "../service/auth.service";

export function createAuthController(authService: AuthService) {
  async function registerController(req: Request, res: Response) {
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  }

  async function loginController(req: Request, res: Response) {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  }

  async function refreshController(req: Request, res: Response) {
    const result = await authService.refresh(req.body);
    res.status(200).json(result);
  }

  return { registerController, loginController, refreshController };
}

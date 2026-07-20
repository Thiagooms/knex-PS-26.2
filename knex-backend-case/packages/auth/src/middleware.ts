import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "@techmart/shared";
import { env } from "./env";

export interface AuthenticatedUser {
  id: string;
  papel: "cliente" | "vendedor";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new AppError("Token de autenticação ausente.", 401);
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    next();
  } catch {
    throw new AppError("Token de autenticação inválido ou expirado.", 401);
  }
}

export function requireRole(papel: AuthenticatedUser["papel"]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.user?.papel !== papel) {
      throw new AppError("Ação não permitida para o seu papel.", 403);
    }
    next();
  };
}

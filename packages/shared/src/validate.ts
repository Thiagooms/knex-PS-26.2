import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type RequestTarget = "body" | "params" | "query";

export function validate(schema: ZodType, target: RequestTarget = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    req[target] = schema.parse(req[target]);
    next();
  };
}

import type { AppError } from "../error/AppError";
import type { RequestHandler } from "express";

export type UContextType = "runtime" | "internal";
export type UHTTPMethod = "get" | "post" | "put" | "delete" | "patch";
export type TResponsePayload<TData = unknown, TMeta = unknown> = {
  error?: ReturnType<AppError["toPlain"]>;
  data?: TData;
  meta?: TMeta;
};
export type TRouteDefinition = {
  method: UHTTPMethod;
  path: string;
  handler: RequestHandler;
};

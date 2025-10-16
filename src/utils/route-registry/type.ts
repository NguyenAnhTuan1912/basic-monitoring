import type { RequestHandler } from "express";

export type HTTPMethod = "get" | "post" | "put" | "delete" | "patch";

export type TRouteDefinition = {
  method: HTTPMethod;
  path: string;
  handler: RequestHandler | Array<RequestHandler>;
};

// Import types
import type { Express } from "express";
import type { SwaggerSchema } from "./SwaggerSchema";
import type { TSwaggerRouteDefinition, TSwaggerResponse } from "./type";

/**
 * Tạo một phản hồi Json.
 *
 * @param status - http status code.
 * @param schema - response schema.
 * @param [description="Success"].
 */
export function jsonResponse(
  status: string,
  schema: SwaggerSchema,
  description = "Success",
): Record<string, TSwaggerResponse> {
  return {
    [status]: {
      description,
      content: {
        "application/json": { schema },
      },
    },
  };
}

/**
 * Thêm các routes trong một group route vào trong doc.
 *
 * @param app - express app.
 * @param routes - các routes đã được định nghĩa.
 * @param swaggerDoc - main swagger doc.
 *
 * @returns
 */
export function registerRoutes(
  app: Express,
  routes: TSwaggerRouteDefinition[],
  swaggerDoc: any,
) {
  routes.forEach((route) => {
    // Swagger Path
    const swaggerPath = route.path.replaceAll(/:(\w+)+/g, "{$1}");

    // Đăng ký vào Express
    if (Array.isArray(route.handler))
      (app as any)[route.method](route.path, ...route.handler);
    else (app as any)[route.method](route.path, route.handler);

    // Đăng ký vào Swagger
    swaggerDoc.paths[swaggerPath] = swaggerDoc.paths[swaggerPath] || {};
    (swaggerDoc.paths[swaggerPath] as any)[route.method] = {
      summary: route.summary,
      description: route.description,
      tags: route.tags,
      parameters: route.parameters,
      requestBody: route.requestBody,
      responses: route.responses,
    };
  });
}

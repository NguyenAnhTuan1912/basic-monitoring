import type { TRouteDefinition } from "src/utils/route-registry/type";
import type { SwaggerSchema } from "./SwaggerSchema";

export type TSwaggerResponse = {
  description: string;
  content?: {
    [contentType: string]: {
      schema: object;
    };
  };
};

export type TSwaggerParameters =
  | {
      name: string;
      in: string;
      required?: boolean;
      schema: SwaggerSchema;
      description?: string;
    }
  | {
      $ref?: string;
    };

export type TSwaggerRouteDefinition = TRouteDefinition & {
  security?: {
    bearerAuth?: Array<any>;
  };
  summary?: string;
  description?: string;
  tags?: Array<string>;
  parameters?: Array<TSwaggerParameters>;
  requestBody?: {
    required?: boolean;
    content: {
      [contentType: string]: {
        schema: SwaggerSchema;
      };
    };
  };
  responses?: {
    [statusCode: string]: TSwaggerResponse;
  };
};

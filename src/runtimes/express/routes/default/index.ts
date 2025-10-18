// Import from cores
import { jsonResponse } from "src/core/docs/swagger/helpers";
import { SwaggerSchema } from "src/core/docs/swagger/SwaggerSchema";

// Import functions
import { getStatusCode } from "src/core/modules/default/functions/get-statuscode";

// Import types
import type { TSwaggerRouteDefinition } from "src/core/docs/swagger/type";

// Tag for Swagger UI grouping
export const defaultTag = "Default routes";

/**
 * Một số các route mặc định khác.
 */
export const defaultRoutes: Array<TSwaggerRouteDefinition> = [
  {
    method: "get",
    path: "/random-error",
    handler: async (req, res) => {
      const code = await getStatusCode();
      return res.status(code).json({ data: `Simulated error: ${code}` });
    },
    summary: "Tạo và trả về lỗi bất kỳ.",
    description:
      "Trả về một lỗi 4xx hoặc 5xx bất kì sau mỗi lần thực thi để giả lập việc thực hiện request bị lỗi.",
    tags: [defaultTag],
    parameters: [],
    responses: {
      ...jsonResponse(
        "200",
        new SwaggerSchema()
          .setType("object")
          .addProperty("data", new SwaggerSchema("string")),
      ),
    },
  },
];

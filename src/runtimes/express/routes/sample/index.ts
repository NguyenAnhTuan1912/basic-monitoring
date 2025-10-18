// Import from cores
import { jsonResponse } from "src/core/docs/swagger/helpers";
import { SwaggerSchema } from "src/core/docs/swagger/SwaggerSchema";

// Import pipelines
import {
  predictFuturePipeline,
  rateCodePipeline,
  motivateDevPipeline,
  catTranslatorPipeline,
  shouldDeployPipeline,
} from "src/core/modules/sample/ports";

// Import from runtimes
import { ExpressRuntimeContext } from "src/runtimes/express/adapters/context";

// Import types
import type { TSwaggerRouteDefinition } from "src/core/docs/swagger/type";

// Tag for Swagger UI grouping
export const sampleTag = "Fun sample routes";

/**
 * Các route vui vẻ dành cho dev 😆
 */
export const sampleRoutes: Array<TSwaggerRouteDefinition> = [
  // 🧙‍♂️ Predict future
  {
    method: "get",
    path: "/sample/predict-future",
    handler: async (req, res, next) => {
      const ctx = new ExpressRuntimeContext(req, res, next);
      return await predictFuturePipeline.run(ctx);
    },
    summary: "Dự đoán tương lai cho dev 🧙‍♂️",
    description: "Trả về một lời tiên tri 'vui vẻ' dành cho lập trình viên.",
    tags: [sampleTag],
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

  // 💩 Rate code
  {
    method: "post",
    path: "/sample/rate-code",
    handler: async (req, res, next) => {
      const ctx = new ExpressRuntimeContext(req, res, next);
      return await rateCodePipeline.run(ctx);
    },
    summary: "Đánh giá code 💩",
    description:
      "Gửi đoạn code trong body để nhận đánh giá 'chân thật' từ pipeline AI (hơi troll).",
    tags: [sampleTag],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: new SwaggerSchema()
            .setType("object")
            .addProperty("code", new SwaggerSchema("string")),
        },
      },
    },
    responses: {
      ...jsonResponse(
        "200",
        new SwaggerSchema()
          .setType("object")
          .addProperty("data", new SwaggerSchema("string")),
      ),
    },
  },

  // 💪 Motivate developer
  {
    method: "get",
    path: "/sample/motivate-dev",
    handler: async (req, res, next) => {
      const ctx = new ExpressRuntimeContext(req, res, next);
      return await motivateDevPipeline.run(ctx);
    },
    summary: "Động viên dev 💪",
    description:
      "Nhập tên dev qua query `name` để nhận một câu động viên tinh thần.",
    tags: [sampleTag],
    parameters: [
      {
        name: "name",
        in: "query",
        required: false,
        schema: new SwaggerSchema().setType("string"),
        description: "Tên của dev (optional)",
      },
    ],
    responses: {
      ...jsonResponse(
        "200",
        new SwaggerSchema()
          .setType("object")
          .addProperty("data", new SwaggerSchema("string")),
      ),
    },
  },

  // 🐱 Cat translator
  {
    method: "post",
    path: "/sample/to-meow",
    handler: async (req, res, next) => {
      const ctx = new ExpressRuntimeContext(req, res, next);
      return await catTranslatorPipeline.run(ctx);
    },
    summary: "Dịch sang tiếng mèo 🐱",
    description: "Truyền message trong body để dịch sang 'meow'.",
    tags: [sampleTag],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: new SwaggerSchema()
            .setType("object")
            .addProperty("message", new SwaggerSchema("string")),
        },
      },
    },
    responses: {
      ...jsonResponse(
        "200",
        new SwaggerSchema()
          .setType("object")
          .addProperty("data", new SwaggerSchema("string")),
      ),
    },
  },

  // 🚀 Should deploy today?
  {
    method: "get",
    path: "/sample/should-deploy",
    handler: async (req, res, next) => {
      const ctx = new ExpressRuntimeContext(req, res, next);
      return await shouldDeployPipeline.run(ctx);
    },
    summary: "Hôm nay có nên deploy không? 🚀",
    description:
      "Đưa ra quyết định 'vui' xem hôm nay có nên deploy hay không (rất thiếu cơ sở khoa học).",
    tags: [sampleTag],
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

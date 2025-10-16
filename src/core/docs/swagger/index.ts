import path from "path";

import swaggerJSDoc from "swagger-jsdoc";

// Import constants
import { Configs } from "../../../utils/configs";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Database Optimization",
      version: "1.0.0",
      description: "Tài liệu API cho Database Optimization",
    },
    components: {
      parameters: {
        XUserIdHeader: {
          name: "X-User-Id",
          in: "header",
          required: false,
          schema: {
            type: "number",
          },
          description: "Id of user",
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://${Configs.SwaggerServerConfigHost}:${Configs.Port}`,
      },
    ],
  },
  apis: [path.join(__dirname, "./routes/*.js")], // nơi chứa comment swagger
};

/** Main Swagger Doc */
const swaggerDoc = swaggerJSDoc(options);

export { swaggerDoc };

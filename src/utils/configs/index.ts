import path from "path";

import dotenv from "dotenv";

import * as StringUtils from "src/utils/string";

dotenv.config();

export const Configs = {
  // Setup server
  Host: process.env.HOST || "localhost",
  Port: parseInt(process.env.PORT || "7800"),

  // Setup Swagger
  SwaggerServerConfigHost:
    process.env.SWAGGER_SERVER_CONFIG_HOST || "localhost",

  ServiceName: process.env.SERVICE_NAME || "my_app",

  // Setup Paths
  SrcPath:
    process.env.SRC_PATH || path.resolve(StringUtils.getRootDir(), "src"),
  LogRoot:
    process.env.LOG_ROOT || path.resolve(StringUtils.getRootDir(), "logs"),
};

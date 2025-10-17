import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import chalk from "chalk";

// Import configs
import { Configs } from "src/utils/configs/index.js";

// Import Swagger
import { swaggerDoc } from "src/core/docs/swagger/index.js";
import { registerRoutes } from "src/core/docs/swagger/helpers.js";

// Import routes
import { sampleRoutes } from "./routes/sample";
// import { quotesRoutes } from "./routes/quotes/index.js";
// import { usersRoutes } from "./routes/users/index.js";
// import { authRoutes } from "./routes/auth/index.js";
// import { pcustomersRoutes } from "./routes/pcustomer-management";

// Monitoring
import { promClient } from "src/core/monitoring";

// Logger
import { LoggerBuilder } from "src/utils/logger/index.js";

// Middlewares
import { middleware_collectRequest } from "./middlewares/collect-request";
import { middleware_logRequest } from "./middlewares/log-request";

const app = express();

// Add global middlewares
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware_collectRequest);
app.use(middleware_logRequest);

// Register routes
registerRoutes(app, sampleRoutes, swaggerDoc);
// registerRoutes(app, quotesRoutes, swaggerDoc);
// registerRoutes(app, usersRoutes, swaggerDoc);
// registerRoutes(app, authRoutes, swaggerDoc);
// registerRoutes(app, pcustomersRoutes, swaggerDoc);

// Setup swagger ui
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Setup Health check
app.use("/health", (req, res) => {
  return res.status(200).end("Ok");
});

// Setup metric collecting
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send(await promClient.getMetrics());
});

app.use("/", (req, res) => {
  return res.json({
    data: { message: "Welcome to Cognito Example Application API" },
  });
});

app.listen(Configs.Port, Configs.Host, () => {
  const baseUrl = `http://${Configs.Host}:${Configs.Port}`;

  console.log(`✅ Server chạy tại ${baseUrl}`);
  console.log(`📖 Swagger UI tại ${baseUrl}/api-docs`);
});

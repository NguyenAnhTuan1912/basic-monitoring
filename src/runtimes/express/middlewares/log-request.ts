import chalk from "chalk";

import { requestDurationSecondsCollector } from "src/core/monitoring";

// Import utils
import { LoggerBuilder } from "src/utils/logger";

// Import types
import type { Request, Response, NextFunction } from "express";

const reqLogger = new LoggerBuilder()
  .to("requests")
  .to("requests.error", { level: "error" })
  .build();

/**
 * Create new handler for finish event of response.
 *
 * @param req
 * @param res
 * @returns - finish event handler
 */
function createWhenFinishHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = performance.now();

  const handle = function () {
    const userAgent = req.headers["user-agent"] || "Unknown";
    const duration = performance.now() - start;
    const statusCode = res.statusCode;

    let msg: string;

    // Log
    if (statusCode >= 400) {
      msg = `${chalk.yellow(req.method)} ${req.originalUrl} - ${chalk.red(statusCode)} ${duration}ms ${userAgent}`;

      reqLogger.error(
        LoggerBuilder.buildNormalLog(msg, {
          userAgent,
          duration,
          statusCode,
        }),
      );
    } else {
      msg = `${chalk.yellow(req.method)} ${req.originalUrl} - ${chalk.green(statusCode)} ${duration}ms ${userAgent}`;

      reqLogger.info(
        LoggerBuilder.buildNormalLog(msg, {
          userAgent,
          duration,
          statusCode,
        }),
      );
    }

    // Collect http request duration second
    // Convert duration (ms) to s
    requestDurationSecondsCollector.observe(duration / 1000);

    res.off("finish", handle);
  };

  return handle;
}

/**
 * Log request.
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export function middleware_logRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const handler = createWhenFinishHandler(req, res, next);

  res.on("finish", handler);

  next();
}

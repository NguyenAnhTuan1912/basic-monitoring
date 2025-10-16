import { PrometheusClient } from "src/core/monitoring/PrometheusClient";

// Import types
import type { Request, Response, NextFunction } from "express";

const promClient = new PrometheusClient();
const requestCollector = PrometheusClient.createRequestCollector(promClient);

const excludeURLs = new Map([
  ["/metrics", true],
  ["/health", true],
]);

/**
 * Collect all requests from user, exclude urls in blacklist.
 *
 * @param req
 * @param res
 * @param next
 */
export function middleware_collectRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (excludeURLs.get(req.originalUrl)) {
    return next();
  }

  res.on("finish", () => {
    requestCollector.inc({ method: req.method, route: req.originalUrl });
  });
  next();
}

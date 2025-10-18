import {
  totalRequestCollector,
  totalRequestStatusCollector,
  concurrentRequestsCollector,
} from "src/core/monitoring";

// Import types
import type { Request, Response, NextFunction } from "express";

const excludeURLs = ["/metrics", "/health", "/api-docs", "/.well-known"];

function getRoute(req: Request) {
  return req.route ? req.route.path : req.path;
}

/**
 * Create new handler for finish event of response.
 *
 * @param req
 * @param res
 * @returns - finish event handler
 */
function createWhenFinishHandler(req: Request, res: Response) {
  const handle = function () {
    // Collect when finish
    // Collect request count
    totalRequestCollector.inc({ method: req.method, route: getRoute(req) });

    // Collect status count
    totalRequestStatusCollector.inc({ status_code: res.statusCode });

    // Decrease concurrent request
    concurrentRequestsCollector.dec({
      method: req.method,
      route: getRoute(req),
    });

    res.off("finish", handle);
  };

  return handle;
}

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
  if (excludeURLs.some((url) => req.originalUrl.startsWith(url))) {
    return next();
  }

  // Collect in the beginning of request
  // Increase concurrent request
  concurrentRequestsCollector.inc({
    method: req.method,
    route: getRoute(req),
  });

  res.on("finish", createWhenFinishHandler(req, res));

  next();
}

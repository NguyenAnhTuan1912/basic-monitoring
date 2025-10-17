import { CronJob } from "cron";

import { PrometheusClient } from "src/core/monitoring/PrometheusClient";
import { promMetricConfig } from "./config";

// Import utils
import { LoggerBuilder } from "src/utils/logger";

const logger = new LoggerBuilder()
  .to("metric_jobs")
  .to("metric_jobs.error", { level: "error" })
  .build();

export const promClient = new PrometheusClient();
export const totalRequestCollector = promClient.createCounter(
  promMetricConfig.httpRequestsTotal.config,
);
export const totalRequestStatusCollector = promClient.createCounter(
  promMetricConfig.httpRequestsStatusTotal.config,
);
export const concurrentRequestsCollector = promClient.createGauge(
  promMetricConfig.httpConcurrentRequests.config,
);

// Setup cronjob
const RESET_VALUE = 0;
const resetTotalRequestsJob = new CronJob(
  "0 0 * * *",
  // Job này sẽ được chạy vào 00:00 giờ mỗi ngày (coi như reset cho ngày mới).
  () => {
    let logMsg = `Execute \`reset ${promMetricConfig.httpRequestsTotal.config.name}\` job (reset to ${RESET_VALUE})`;

    try {
      logger.info(logMsg);
      totalRequestCollector.reset();
    } catch (error: any) {
      logger.error(`resetTotalRequestsJob: ${error.message}`);
    }
  },
  null,
  false,
  "UTC",
);

const resetTotalRequestStatusJob = new CronJob(
  "0 0 * * *",
  // Job này sẽ được chạy vào 00:00 giờ mỗi ngày (coi như reset cho ngày mới).
  () => {
    let logMsg = `Execute \`reset ${promMetricConfig.httpRequestsStatusTotal.config.name}\` job (reset to ${RESET_VALUE})`;

    try {
      logger.info(logMsg);
      totalRequestCollector.reset();
    } catch (error: any) {
      logger.error(`resetTotalRequestStatusJob: ${error.message}`);
    }
  },
  null,
  false,
  "UTC",
);

// Start jobs
resetTotalRequestsJob.start();
resetTotalRequestStatusJob.start();

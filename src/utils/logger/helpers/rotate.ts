import path from "path";
import winston from "winston";
import { CronJob } from "cron";

// Import types
import type { Logger } from "winston";
import type { LoggerBuilder } from "../index.js";

// Import helpers
import generateFilename from "./generate-filename.js";

const CRONS = {
  EACH_MINUTE: "*/1 * * * *",
  FIRST_SECOND_OF_EACH_HOUR: "0 * * * *",
  START_OF_EACH_DAY: "0 7 * * *",
};

/**
 * Use to create standard log daily rotate
 * @param  logger
 * @param  loggerBuilder
 * @param  logRoot
 * @returns
 */
export default function creatLogsDailyRotate(
  logger: Logger,
  loggerBuilder: LoggerBuilder,
  logRoot: string,
) {
  // At minute 0 of each hour, create new files
  return new CronJob(CRONS.START_OF_EACH_DAY, function () {
    const transportConfigurations = loggerBuilder.getTransportConfigurations();
    const N = transportConfigurations.length;

    // Remove file transport
    logger.transports.forEach((t) => {
      if (t instanceof winston.transports.File) {
        logger.remove(t);
      }
    });

    for (let i = 0; i < N; i++) {
      const destination = transportConfigurations[i].destination;

      const fileName = path.resolve(
        logRoot,
        generateFilename(destination, transportConfigurations[i].level),
      );

      transportConfigurations[i].filename = fileName;

      logger.add(new winston.transports.File(transportConfigurations[i]));
    }
  });
}

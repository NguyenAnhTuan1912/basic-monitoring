import winston from "winston";
import path from "path";
import chalk from "chalk";

// Import configs
import { Configs } from "../configs";

// Impport utils
import * as StringUtils from "../string";

// Import helpers
import getSystemlog from "./helpers/get-system-log";
import mergeLogs from "./helpers/merge-logs";
import creatLogsDailyRotate from "./helpers/rotate";
import generateFilename from "./helpers/generate-filename";

// Import types
import type { LoggerBuilderOptions } from "./type";

const { combine, timestamp, label, printf } = winston.format;

// Logs folder will place in root of the project
const LOG_ROOT = Configs.LogRoot;

/**
 * Standardize the output format of console (string format)
 */
const stringFormat = printf((info: any) => {
  const systemLog = getSystemlog(info);
  let content = info.message;

  // If info has endpoint
  // Rebuild `content`
  // Format should be: METHOD URL - MESSAGE
  if (info.endpoint)
    content = `${info.endpoint.method} ${info.endpoint.url} - ${content}`;

  // If info has dao
  // Rebuild `content`
  // Format should be: METHOD SOURCE - MESSAGE
  if (info.dao) {
    content = `${info.dao.method} ${info.dao.source} - ${content}`;
  }

  return mergeLogs(systemLog, content);
});

/**
 * Standardize the output format of json format. In json format,
 * we don't have to process to much, just spread the object (for now)
 */
const jsonFormat = printf((info: any) => {
  const result = {
    ...info,
    level: info.level,
    source: info.label,
    message: info.message,
    timestamp,
  };

  const { label, ...finalResult } = result;

  return JSON.stringify(finalResult);
});

/**
 * Create a full managed logger. You may want to
 */
export class LoggerBuilder {
  static LogFilePattern = "^w+\\.(log|txt)$";
  static OtherServerityLogFilePattern =
    "^w+\\.(error|warn|debug|fatal)\\.(log|txt)$";

  /**
   * Root logger
   */
  static Logger = new LoggerBuilder()
    .to("logs")
    .to("logs.error", { level: "error" })
    .build();

  private defaultLabel: string = "backend";
  private rootLevel: string;
  private canLogToConsole: boolean;
  private canRotate: boolean;
  private _transports: Array<any>;
  private _transportConfigurations: Array<any>;
  private _instance!: ReturnType<typeof winston.createLogger>;

  constructor(options: LoggerBuilderOptions = {}) {
    // Setup
    this.rootLevel = options.rootLevel ? options.rootLevel : "info";
    this.defaultLabel = options.label ? options.label : this.defaultLabel;
    this.canLogToConsole = options.canLogToConsole
      ? options.canLogToConsole
      : true;
    this.canRotate = options.canRotate ? options.canRotate : true;
    this._transports = [];
    this._transportConfigurations = [];

    // Setup transport
    if (this.canLogToConsole) {
      this._transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }), // để log cả stack trace
            winston.format.printf(({ level, message, timestamp, ...meta }) => {
              let maxLength = 5;

              if (level.toLowerCase() === "info") {
                level = chalk.blueBright(`${level.padEnd(maxLength, " ")}`);
              } else if (level.toLowerCase() === "warn") {
                level = chalk.yellowBright(`${level.padEnd(maxLength, " ")}`);
              } else if (level.toLowerCase() === "error") {
                level = chalk.redBright(level);
              } else if (level.toLowerCase() === "debug") {
                level = chalk.bgWhite(chalk.black(level));
              } else if (level.toLowerCase() === "fatal") {
                level = chalk.bgRed(chalk.black(level));
              }

              return `${chalk.yellow(new Date(timestamp as string).toLocaleString())} [${level}]: ${message}`;
            }),
          ),
        }),
      );
    }
  }

  /**
   * Build a standard log
   * @param message
   * @param  meta
   */
  static buildNormalLog(message: string, meta?: any) {
    let log = {
      message,
    };

    if (meta) {
      log = {
        ...log,
        ...meta,
      };
    }

    return log;
  }

  /**
   * Build a standard log object of `endpoint` (base on Express)
   * @param message
   * @param req
   * @param meta
   * @returns
   */
  static buildEndpointLog(message: string, req: any, meta?: any) {
    let log = {
      message,
      endpoint: {
        method: req.method,
        url: req.path,
      },
    };

    if (meta) {
      log = {
        ...log,
        ...meta,
      };
    }

    return log;
  }

  /**
   * Use to build a standard log object of `DAO`. `DAO` can be created from multiple ORM like
   * Sequelize or Mongoose so we need to standardize to get necessary information.
   * @param message
   * @param dao
   * @param result
   * @param meta
   * @returns
   */
  static buildDAOLog(message: string, dao: any, result: any, meta?: any) {
    let log = {
      message,
      dao: {
        method: dao.method,
        source: dao.source,
        result,
      },
    };

    if (meta) {
      log = {
        ...log,
        ...meta,
      };
    }

    return log;
  }

  /**
   * Enable log rotation.
   */
  enableRotate() {
    this.canRotate = true;
  }

  /**
   * Disable log rotation.
   */
  disableRorate() {
    this.canRotate = false;
  }

  /**
   * Set root level of the logger
   * @param level
   * @returns
   */
  setRootLevel(level: string) {
    this.rootLevel = level;
    return this;
  }

  /**
   * Add more destination to the logger
   * @param destination
   * @returns
   */
  to(destination: string, options?: any) {
    const logFileRegex = new RegExp(LoggerBuilder.LogFilePattern);

    if (logFileRegex.test(destination)) {
      console.error(`Invalid name ${destination}, log file need only filename`);
      return this;
    }

    let defaultFormatFn = winston.format.printf((log) => {
      return JSON.stringify(log);
    });
    let defaultLevel = this.rootLevel;

    // Check if has format
    if (options && options.format && options.format === "string") {
      defaultFormatFn = stringFormat;
    }

    if (options && options.level && options.level !== "info") {
      // Check format for destination file
      defaultLevel = options.level;
    }

    const configuration = {
      destination,
      level: defaultLevel,
      filename: path.resolve(
        LOG_ROOT,
        generateFilename(destination, defaultLevel),
      ),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        defaultFormatFn,
      ),
    };

    // Save
    this._transportConfigurations.push(configuration);
    this._transports.push(new winston.transports.File(configuration));

    return this;
  }

  /**
   * Build the final instance of winston logger
   * @returns
   */
  build() {
    this._instance = winston.createLogger({
      level: this.rootLevel,
      format: combine(
        label({ label: this.defaultLabel }),
        timestamp(),
        jsonFormat,
      ),
      transports: this._transports,
    });

    // Create new cronjob if possible
    if (this.canRotate) {
      const job = creatLogsDailyRotate(this._instance, this, LOG_ROOT);
      job.start();
    }

    return this._instance;
  }

  /**
   * Use to set new update
   * @param transports
   */
  setNewTransports(transports: Array<any>) {
    // Clear transports
    this.clearTransports();

    transports.forEach((transport) => {
      this._transports.push(transport);
    });
  }

  /**
   * Use to get configurations of transports
   * @returns
   */
  getTransportConfigurations() {
    return this._transportConfigurations;
  }

  /**
   * Use to get transports
   */
  getTransports() {
    return this._transports;
  }

  /**
   * Use to clear transport
   */
  clearTransports() {
    while (this._transports.length !== 0) {
      this._transports.pop();
    }
  }
}

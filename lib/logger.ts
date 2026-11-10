import winston from "winston";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom log format for readable console output
const customConsoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
  const logMessage = stack || message;
  return `[${timestamp}] [${level}]: ${logMessage}${metaString}`;
});

const isDevelopment = process.env.NODE_ENV !== "production";
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info");

// Define transports
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: isDevelopment
      ? combine(
          colorize({ all: true }),
          timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          errors({ stack: true }),
          customConsoleFormat
        )
      : combine(
          timestamp(),
          errors({ stack: true }),
          json()
        ),
  }),
];

// Add file logging if running in a Node.js server environment with write permissions
if (typeof window === "undefined" && process.env.ENABLE_FILE_LOGGING === "true") {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: combine(timestamp(), errors({ stack: true }), json()),
    })
  );
}

export const logger = winston.createLogger({
  level: logLevel,
  levels: winston.config.npm.levels,
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    winston.format.splat()
  ),
  transports,
  exitOnError: false,
});

export default logger;


import { createPinoLogger, pino } from "@bogeychan/elysia-logger";
import { env } from "../config/env";

export const logger = createPinoLogger({
	level: env.LOG_LEVEL,
	timestamp: pino.stdTimeFunctions.isoTime,
	transport:
		env.NODE_ENV === "production"
			? undefined
			: {
					targets: [
						{
							target: "pino-pretty",
							options: {
								colorize: true,
								ignore: "pid,hostname,service",
								messageFormat: "[{service}] {msg}",
							},
						},
					],
				},
});

export const createLogger = (service: string) => logger.child({ service });

import { resolve } from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
	path: [resolve(process.cwd(), ".env"), resolve(process.cwd(), ".env.local")],
	override: true,
});

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	DATABASE_SSL_ENABLED: z.stringbool().default(true),
	LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("❌ Invalid environment variables");
	const formattedErrors = parsedEnv.error.issues.map((issue) => {
		const path = issue.path.length > 0 ? issue.path.join(".") : "ENV";
		return `- ${path}: ${issue.message}`;
	});
	console.error(formattedErrors.join("\n"));
	process.exit(1);
}

export const env = parsedEnv.data;
export type Env = typeof env;

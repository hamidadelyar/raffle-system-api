import { Elysia } from "elysia";
import { AppError } from "../errors/app-error";

export const errorHandlerPlugin = new Elysia().onError(
	({ code, error, set }) => {
		if (error instanceof AppError) {
			return error.toResponse();
		}

		if (code === "VALIDATION") {
			const appError = new AppError(
				error.type === "params" ? "INVALID_ROUTE_PARAMS" : "INVALID_REQUEST",
				error.type === "params"
					? "Invalid route parameters"
					: "Invalid request",
				400,
			);

			return appError.toResponse();
		}

		if (code === "NOT_FOUND") {
			return new AppError("NOT_FOUND", "Route not found", 404).toResponse();
		}

		console.error(error);
		set.status = 500;

		return {
			error: {
				code: "INTERNAL_SERVER_ERROR",
				message: "Something went wrong",
			},
		};
	},
);

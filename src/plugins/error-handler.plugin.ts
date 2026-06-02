import { Elysia, type ErrorHandler, InvertedStatusMap } from "elysia";
import { ApiError } from "../errors/api-error";

export type ErrorResponse = {
	success: false;
	data: null;
	error: string;
};

const createErrorResponse = (message: string): ErrorResponse => ({
	success: false,
	data: null,
	error: message,
});

const getSafeErrorMessage = (status: number): string =>
	(InvertedStatusMap as Record<number, string>)[status] ??
	"An unexpected error occurred";

const getStatusFromError = (error: unknown, code?: string | number): number => {
	if (error instanceof ApiError) {
		return error.statusCode;
	}

	if (typeof code === "number") {
		return code;
	}

	if (
		error instanceof Error &&
		"status" in error &&
		typeof error.status === "number"
	) {
		return error.status;
	}

	if (
		error instanceof Error &&
		"statusCode" in error &&
		typeof error.statusCode === "number"
	) {
		return error.statusCode;
	}

	return 500;
};

const getMessageFromError = (error: unknown, status: number): string => {
	if (error instanceof ApiError) {
		return error.message;
	}

	return getSafeErrorMessage(status);
};

export const safeErrorHandler: ErrorHandler = ({ code, error, set }) => {
	/**
	 * Let Elysia handle its own built-in errors.
	 * This keeps validation and 404 responses consistent with the framework.
	 */
	if (code === "VALIDATION" || code === "NOT_FOUND") {
		return;
	}

	const status = getStatusFromError(error, code);

	set.status = status;

	return createErrorResponse(getMessageFromError(error, status));
};

export const errorHandlerPlugin = new Elysia().onError(
	{ as: "global" },
	safeErrorHandler,
);

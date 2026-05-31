type Code =
	| "UNAUTHORIZED"
	| "BAD_REQUEST"
	| "NOT_FOUND"
	| "CONFLICT"
	| "INTERNAL_ERROR"
	| "VALIDATION_ERROR";

export class ApiError extends Error {
	constructor(
		public readonly statusCode: number,
		public readonly code: Code,
		message: string,
		public readonly details?: Record<string, unknown>,
	) {
		super(message);
		Object.setPrototypeOf(this, ApiError.prototype);
	}

	static badRequest(
		message: string,
		details?: Record<string, unknown>,
	): ApiError {
		return new ApiError(400, "BAD_REQUEST", message, details);
	}

	static notFound(message: string): ApiError {
		return new ApiError(404, "NOT_FOUND", message);
	}

	static conflict(message: string): ApiError {
		return new ApiError(409, "CONFLICT", message);
	}

	static internal(message: string): ApiError {
		return new ApiError(500, "INTERNAL_ERROR", message);
	}

	static validation(
		message: string,
		details?: Record<string, unknown>,
	): ApiError {
		return new ApiError(422, "VALIDATION_ERROR", message, details);
	}
}

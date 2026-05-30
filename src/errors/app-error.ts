export type ErrorCode =
	| "INVALID_REQUEST"
	| "INVALID_ROUTE_PARAMS"
	| "RAFFLE_NOT_FOUND"
	| "NOT_FOUND"
	| "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
	constructor(
		public readonly errorCode: ErrorCode,
		message: string,
		public readonly status = 500,
	) {
		super(message);
		this.name = "AppError";
	}

	toResponse() {
		console.error(`[${this.errorCode}] ${this.message}`);

		return Response.json(
			{
				error: {
					code: this.errorCode,
					message: this.message,
				},
			},
			{ status: this.status },
		);
	}
}

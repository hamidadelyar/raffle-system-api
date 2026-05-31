import { Elysia } from "elysia";
import { ApiError } from "../errors/api-error";

export type AuthUser = {
	id: string;
	email?: string;
};

export type AuthContext = {
	getAuthenticatedUser: () => Promise<AuthUser>;
};

type MockJwtPayload = {
	sub?: unknown;
	email?: unknown;
};

export const authPlugin = new Elysia({ name: "auth" }).derive(
	{ as: "global" },
	({ headers }) => {
		return {
			getAuthenticatedUser: async (): Promise<AuthUser> => {
				const authHeader = headers.authorization;

				if (!authHeader?.startsWith("Bearer ")) {
					throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
				}

				const token = authHeader.slice("Bearer ".length);
				const payload = decodeMockJwt(token);

				if (typeof payload.sub !== "string" || payload.sub.length === 0) {
					throw new ApiError(401, "UNAUTHORIZED", "Invalid mock token payload");
				}

				return {
					id: payload.sub,
					email: typeof payload.email === "string" ? payload.email : undefined,
				};
			},
		};
	},
);

function decodeMockJwt(token: string): MockJwtPayload {
	const [, payload] = token.split(".");

	if (!payload) {
		return {};
	}

	try {
		const json = Buffer.from(payload, "base64url").toString("utf8");
		return JSON.parse(json) as MockJwtPayload;
	} catch {
		return {};
	}
}

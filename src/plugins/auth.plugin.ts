import Elysia from "elysia";
import { ApiError } from "../errors/api-error";

export type AuthUser = {
	id: string;
	email?: string;
};

type MockJwtPayload = {
	sub?: unknown;
	email?: unknown;
};

export const authPlugin = new Elysia({ name: "auth" })
	.derive({ as: "scoped" }, ({ headers }) => {
		const user = getUserFromAuthorizationHeader(headers.authorization);
		return { user };
	})
	.onBeforeHandle({ as: "scoped" }, ({ user }) => {
		if (!user) {
			throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
		}
	});

function getUserFromAuthorizationHeader(
	authHeader: string | undefined,
): AuthUser | null {
	if (!authHeader?.startsWith("Bearer ")) {
		return null;
	}
	const token = authHeader.slice("Bearer ".length);
	const payload = decodeMockJwt(token);
	if (typeof payload.sub !== "string" || !isUuid(payload.sub)) {
		return null;
	}
	return {
		id: payload.sub,
		email: typeof payload.email === "string" ? payload.email : undefined,
	};
}

function isUuid(value: string): boolean {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
		value,
	);
}

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

import { describe, expect, test } from "bun:test";
import Elysia from "elysia";
import { authPlugin } from "./auth.plugin";

describe("auth.plugin.ts", () => {
	test("returns 401 when Authorization header is missing", async () => {
		const app = createTestApp();
		const response = await app.handle(
			new Request("http://localhost/protected"),
		);
		expect(response.status).toBe(401);
	});

	test("returns 401 when Authorization header is not a Bearer token", async () => {
		const app = createTestApp();
		const response = await app.handle(
			new Request("http://localhost/protected", {
				headers: {
					authorization: "Basic abc123",
				},
			}),
		);
		expect(response.status).toBe(401);
	});

	test("allows request when token has a valid sub", async () => {
		const app = createTestApp();
		const token = createMockJwt({
			sub: "user_123",
			email: "test@example.com",
		});
		const response = await app.handle(
			new Request("http://localhost/protected", {
				headers: {
					authorization: `Bearer ${token}`,
				},
			}),
		);
		const body = await response.json();
		expect(response.status).toBe(200);
		expect(body).toEqual({
			data: {
				id: "user_123",
				email: "test@example.com",
			},
		});
	});

	test("returns 401 when token payload is invalid JSON", async () => {
		const app = createTestApp();
		const response = await app.handle(
			new Request("http://localhost/protected", {
				headers: {
					authorization: "Bearer mock.not-valid-base64.signature",
				},
			}),
		);
		expect(response.status).toBe(401);
	});

	test("returns 401 when token is not JWT shaped", async () => {
		const app = createTestApp();
		const response = await app.handle(
			new Request("http://localhost/protected", {
				headers: {
					authorization: "Bearer invalid-token",
				},
			}),
		);
		expect(response.status).toBe(401);
	});
});

function createTestApp() {
	return new Elysia().use(authPlugin).get("/protected", ({ user }) => {
		return {
			data: user,
		};
	});
}

function createMockJwt(payload: object): string {
	const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
		"base64url",
	);
	return `mock.${encodedPayload}.signature`;
}

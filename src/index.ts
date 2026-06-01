import { openapi } from "@elysia/openapi";
import { createApplication } from "difunkt";
import { Elysia } from "elysia";
import { AppModule } from "./app.module";
import { RaffleServiceProvider } from "./features/raffle/raffle.providers";
import { createRaffleRoutes } from "./features/raffle/raffle.routes";
import { TicketServiceProvider } from "./features/ticket/ticket.providers";
import { createTicketRoutes } from "./features/ticket/ticket.routes";
import { errorHandlerPlugin } from "./plugins/error-handler.plugin";

export async function createHttpApp() {
	const resolve = await createApplication(AppModule);
	const raffleService = resolve(RaffleServiceProvider);
	const ticketService = resolve(TicketServiceProvider);

	return new Elysia()
		.use(openapi())
		.use(errorHandlerPlugin)
		.get("/health", () => ({ status: "ok" }), {
			detail: {
				tags: ["System"],
				summary: "Check API health",
				description:
					"Returns a simple status response that can be used by uptime checks and load balancers.",
			},
		})
		.use(createRaffleRoutes(raffleService))
		.use(createTicketRoutes(ticketService));
}

const app = await createHttpApp();
app.listen(process.env.PORT ?? 3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

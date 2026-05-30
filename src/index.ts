import { createApplication } from "difunkt";
import { Elysia } from "elysia";
import { AppModule } from "./app.module";
import { RaffleServiceProvider } from "./features/raffle/raffle.providers";
import { createRaffleRoutes } from "./features/raffle/raffle.routes";

export async function createHttpApp() {
	const resolve = await createApplication(AppModule);
	const raffleService = resolve(RaffleServiceProvider);
	return new Elysia()
		.get("/health", () => ({ status: "ok" }))
		.use(createRaffleRoutes(raffleService));
}

const app = await createHttpApp();
app.listen(process.env.PORT ?? 3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

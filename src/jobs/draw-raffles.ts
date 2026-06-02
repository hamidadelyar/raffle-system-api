import { createApplication } from "difunkt";
import { AppModule } from "../app.module";
import { RaffleServiceProvider } from "../features/raffle/raffle.providers";
import { createLogger } from "../plugins/logger.plugin";

const log = createLogger("DrawRafflesJob");

const resolve = await createApplication(AppModule);
const raffleService = resolve(RaffleServiceProvider);

try {
	const drawnRaffles = await raffleService.drawDueRaffles();

	log.info({ count: drawnRaffles.length }, "Drawn raffles");
	process.exit(0);
} catch (error) {
	log.error({ error }, "Failed to draw raffles");
	process.exit(1);
}

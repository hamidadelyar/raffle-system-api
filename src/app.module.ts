import { createModule } from "difunkt";
import { DatabaseProvider } from "./db/client";
import { RaffleModule } from "./features/raffle/raffle.module";

export const AppModule = createModule({
	providers: [DatabaseProvider],
	imports: [RaffleModule],
});

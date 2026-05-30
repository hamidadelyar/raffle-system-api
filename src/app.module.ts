import { createModule } from "difunkt";
import { DatabaseModule } from "./db/db.module";
import { RaffleModule } from "./features/raffle/raffle.module";

export const AppModule = createModule({
	imports: [DatabaseModule, RaffleModule],
});

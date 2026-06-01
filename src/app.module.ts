import { createModule } from "difunkt";
import { DatabaseModule } from "./db/db.module";
import { RaffleModule } from "./features/raffle/raffle.module";
import { TicketModule } from "./features/ticket/ticket.module";

export const AppModule = createModule({
	imports: [DatabaseModule, RaffleModule, TicketModule],
});

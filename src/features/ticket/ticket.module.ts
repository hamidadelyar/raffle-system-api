import { createModule } from "difunkt";
import {
	TicketRepositoryProvider,
	TicketServiceProvider,
} from "./ticket.providers";

export const TicketModule = createModule({
	providers: [TicketRepositoryProvider, TicketServiceProvider],
});

import { createModule } from "difunkt";
import { UserModule } from "../user/user.module";
import {
	TicketRepositoryProvider,
	TicketServiceProvider,
} from "./ticket.providers";

export const TicketModule = createModule({
	imports: [UserModule],
	providers: [TicketRepositoryProvider, TicketServiceProvider],
});

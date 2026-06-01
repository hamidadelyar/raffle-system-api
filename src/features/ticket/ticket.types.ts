import type { Static } from "@sinclair/typebox";
import type { ticketSchema } from "./ticket.schemas";

export type ITicket = Static<typeof ticketSchema>;

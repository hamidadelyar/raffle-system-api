import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { tickets } from "../../db/schema";
import { successResponseFields } from "../../response.schemas";

export const ticketSchema = createSelectSchema(tickets);

export const ticketResponseSchema = t.Object({
	data: ticketSchema,
	...successResponseFields,
});

export const ticketListResponseSchema = t.Object({
	data: t.Array(ticketSchema),
	...successResponseFields,
});

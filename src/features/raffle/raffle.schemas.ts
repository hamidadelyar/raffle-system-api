import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { prizes, raffles } from "../../db/schema";
import { successResponseFields } from "../../response.schemas";

const _prizeSchema = createSelectSchema(prizes);
export const prizeSelectSchema = t.Omit(_prizeSchema, [
	"createdAt",
	"updatedAt",
]);

const _raffleSchema = createSelectSchema(raffles);
export const raffleStatusSchema = _raffleSchema.properties.status;

export const raffleSchema = t.Omit(
	t.Object({
		..._raffleSchema.properties,
		prize: prizeSelectSchema,
	}),
	["prizeId"],
);

export const raffleResponseSchema = t.Object({
	data: raffleSchema,
	...successResponseFields,
});

export const raffleListResponseSchema = t.Object({
	data: t.Array(raffleSchema),
	...successResponseFields,
});

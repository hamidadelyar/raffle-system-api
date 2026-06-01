import { t } from "elysia";

export const successResponseFields = {
	success: t.Literal(true),
	error: t.Null(),
};

export const errorResponseFields = {
	success: t.Literal(false),
	data: t.Null(),
	error: t.String(),
};

export const errorResponseSchema = t.Object(errorResponseFields);

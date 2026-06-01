import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { users } from "../../db/schema";

const _userSchema = createSelectSchema(users);
export const userSelectSchema = t.Omit(_userSchema, ["createdAt", "updatedAt"]);

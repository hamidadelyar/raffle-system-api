import type { Static } from "@sinclair/typebox";
import type { userSelectSchema } from "./user.schemas";

export type IUser = Static<typeof userSelectSchema>;

import { createProvider } from "difunkt";
import { DatabaseProvider } from "../../db/db.provider";
import { UserRepository } from "./user.repository";

export const UserRepositoryProvider = createProvider(({ inject }) => {
	const db = inject(DatabaseProvider);
	return new UserRepository(db);
});

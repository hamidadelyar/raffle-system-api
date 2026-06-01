import { eq } from "drizzle-orm";
import type { Database } from "../../db/create-db-client";
import { users } from "../../db/schema";

export class UserRepository {
	constructor(private readonly db: Database) {}

	async findUser(userId: string): Promise<PurchaseUser | null> {
		const [user] = await this.db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		return user ?? null;
	}
}

export type PurchaseUser = Pick<typeof users.$inferSelect, "balance" | "id">;

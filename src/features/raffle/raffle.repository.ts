import type { Database } from "../../db/client";

export class RaffleRepository {
	constructor(private readonly db: Database) {}
	async findAll() {
		// TODO: select raffles from db
		return [];
	}
	async findById(id: string) {
		// TODO: select raffle by id
		return null;
	}
}

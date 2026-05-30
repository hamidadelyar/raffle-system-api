import type { RaffleRepository } from "./raffle.repository";
import type { IRaffle } from "./raffle.types";

export class RaffleService {
	constructor(private readonly raffleRepository: RaffleRepository) {}

	async listRaffles(): Promise<IRaffle[]> {
		return this.raffleRepository.findAll();
	}

	async getRaffle(id: string): Promise<IRaffle | null> {
		return this.raffleRepository.findById(id);
	}
}

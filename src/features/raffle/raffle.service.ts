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

	async drawDueRaffles(): Promise<DrawnRaffle[]> {
		return this.raffleRepository.withLockedDueRaffles(
			async (tx, dueRaffles) => {
				const drawnRaffles: DrawnRaffle[] = [];

				for (const raffle of dueRaffles) {
					const winner = await this.raffleRepository.findRandomWinner(
						tx,
						raffle.id,
					);

					if (!winner) {
						continue;
					}

					await this.raffleRepository.markDrawn(tx, raffle.id, winner.userId);
					drawnRaffles.push({ raffleId: raffle.id, winnerId: winner.userId });
				}

				return drawnRaffles;
			},
		);
	}
}

type DrawnRaffle = {
	raffleId: string;
	winnerId: string;
};

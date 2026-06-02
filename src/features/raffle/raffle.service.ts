import { logger } from "../../plugins/logger.plugin";
import type { RaffleRepository } from "./raffle.repository";
import type { IRaffle } from "./raffle.types";

const log = logger.child({ service: "RaffleService" });

export class RaffleService {
	constructor(private readonly raffleRepository: RaffleRepository) {}

	async listRaffles(): Promise<IRaffle[]> {
		log.debug("Listing raffles");
		const raffles = await this.raffleRepository.findAllActive();
		log.info({ count: raffles.length }, "Listed raffles");

		return raffles;
	}

	async getRaffle(id: string): Promise<IRaffle | null> {
		log.debug({ raffleId: id }, "Getting raffle");
		const raffle = await this.raffleRepository.findById(id);

		if (!raffle) {
			log.warn({ raffleId: id }, "Raffle not found");
			return null;
		}

		log.info({ raffleId: id }, "Got raffle");

		return raffle;
	}

	async drawDueRaffles(): Promise<DrawnRaffle[]> {
		log.info("Drawing due raffles");

		return this.raffleRepository.withLockedDueRaffles(
			async (tx, dueRaffles) => {
				log.info({ count: dueRaffles.length }, "Locked due raffles");
				const drawnRaffles: DrawnRaffle[] = [];

				for (const raffle of dueRaffles) {
					const winner = await this.raffleRepository.findRandomWinner(
						tx,
						raffle.id,
					);

					if (!winner) {
						await this.raffleRepository.markCancelled(tx, raffle.id);
						log.info(
							{ raffleId: raffle.id },
							"Cancelled raffle without winner",
						);
						continue;
					}

					await this.raffleRepository.markDrawn(tx, raffle.id, winner.userId);
					log.info(
						{ raffleId: raffle.id, winnerId: winner.userId },
						"Drew raffle winner",
					);
					drawnRaffles.push({ raffleId: raffle.id, winnerId: winner.userId });
				}

				log.info({ count: drawnRaffles.length }, "Drawn due raffles");

				return drawnRaffles;
			},
		);
	}
}

type DrawnRaffle = {
	raffleId: string;
	winnerId: string;
};

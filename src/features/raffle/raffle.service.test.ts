import { describe, expect, test } from "bun:test";
import { createApplication } from "difunkt";
import { RaffleModule } from "./raffle.module";
import {
	RaffleRepositoryProvider,
	RaffleServiceProvider,
} from "./raffle.providers";
import type { RaffleRepository } from "./raffle.repository";
import type { IRaffle } from "./raffle.types";

const raffleId = "78bfd313-c266-4a1f-8b58-aa8f62ad31b5";
const userId = "0d80ce5c-dbd9-46bb-bf3b-cc74a19c38ab";

type MockRaffleRepository = Pick<
	RaffleRepository,
	"findRandomWinner" | "markCancelled" | "markDrawn" | "withLockedDueRaffles"
>;

async function createRaffleService(repository: MockRaffleRepository) {
	const resolve = await createApplication(RaffleModule, {
		providers: [
			{
				provide: RaffleRepositoryProvider,
				value: repository,
			},
		],
	});

	return resolve(RaffleServiceProvider);
}

function createMockRaffleRepository({
	markCancelledCalls = [],
	markDrawnCalls = [],
	winner = { userId },
}: {
	markCancelledCalls?: string[];
	markDrawnCalls?: Array<{ raffleId: string; userId: string }>;
	prize?: { id: string } | null;
	raffle?: IRaffle;
	winner?: { userId: string } | null;
} = {}): MockRaffleRepository {
	const tx = {} as Parameters<
		Parameters<RaffleRepository["withLockedDueRaffles"]>[0]
	>[0];

	return {
		withLockedDueRaffles: async (handler) => handler(tx, [{ id: raffleId }]),
		findRandomWinner: async () => winner,
		markDrawn: async (_tx, raffleId, userId) => {
			markDrawnCalls.push({ raffleId, userId });
		},
		markCancelled: async (_tx, raffleId) => {
			markCancelledCalls.push(raffleId);
		},
	};
}

describe("RaffleService", () => {
	test("draws due raffles that have tickets", async () => {
		const markDrawnCalls: Array<{ raffleId: string; userId: string }> = [];
		const markCancelledCalls: string[] = [];
		const raffleRepository = createMockRaffleRepository({
			markCancelledCalls,
			markDrawnCalls,
			winner: { userId },
		});
		const raffleService = await createRaffleService(raffleRepository);

		const result = await raffleService.drawDueRaffles();

		expect(result).toEqual([{ raffleId, winnerId: userId }]);
		expect(markDrawnCalls).toEqual([{ raffleId, userId }]);
		expect(markCancelledCalls).toEqual([]);
	});

	test("cancels due raffles that have sold no tickets", async () => {
		const markDrawnCalls: Array<{ raffleId: string; userId: string }> = [];
		const markCancelledCalls: string[] = [];
		const raffleRepository = createMockRaffleRepository({
			markCancelledCalls,
			markDrawnCalls,
			winner: null,
		});
		const raffleService = await createRaffleService(raffleRepository);

		const result = await raffleService.drawDueRaffles();

		expect(result).toEqual([]);
		expect(markDrawnCalls).toEqual([]);
		expect(markCancelledCalls).toEqual([raffleId]);
	});
});

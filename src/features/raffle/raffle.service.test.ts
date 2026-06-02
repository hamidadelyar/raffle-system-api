import { describe, expect, test } from "bun:test";
import { RaffleService } from "./raffle.service";

const raffleId = "78bfd313-c266-4a1f-8b58-aa8f62ad31b5";
const userId = "0d80ce5c-dbd9-46bb-bf3b-cc74a19c38ab";

describe("RaffleService", () => {
	test("draws due raffles that have tickets", async () => {
		const tx = {};
		const markDrawnCalls: Array<{ raffleId: string; userId: string }> = [];
		const markCancelledCalls: string[] = [];
		const raffleService = new RaffleService({
			withLockedDueRaffles: async (handler) => handler(tx, [{ id: raffleId }]),
			findRandomWinner: async () => ({ userId }),
			markDrawn: async (_tx, raffleId, userId) => {
				markDrawnCalls.push({ raffleId, userId });
			},
			markCancelled: async (_tx, raffleId) => {
				markCancelledCalls.push(raffleId);
			},
		} as never);

		const result = await raffleService.drawDueRaffles();

		expect(result).toEqual([{ raffleId, winnerId: userId }]);
		expect(markDrawnCalls).toEqual([{ raffleId, userId }]);
		expect(markCancelledCalls).toEqual([]);
	});

	test("cancels due raffles that have sold no tickets", async () => {
		const tx = {};
		const markDrawnCalls: Array<{ raffleId: string; userId: string }> = [];
		const markCancelledCalls: string[] = [];
		const raffleService = new RaffleService({
			withLockedDueRaffles: async (handler) => handler(tx, [{ id: raffleId }]),
			findRandomWinner: async () => null,
			markDrawn: async (_tx, raffleId, userId) => {
				markDrawnCalls.push({ raffleId, userId });
			},
			markCancelled: async (_tx, raffleId) => {
				markCancelledCalls.push(raffleId);
			},
		} as never);

		const result = await raffleService.drawDueRaffles();

		expect(result).toEqual([]);
		expect(markDrawnCalls).toEqual([]);
		expect(markCancelledCalls).toEqual([raffleId]);
	});
});

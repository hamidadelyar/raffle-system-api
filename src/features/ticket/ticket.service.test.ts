import { describe, expect, test } from "bun:test";
import { createApplication } from "difunkt";
import { ApiError } from "../../errors/api-error";
import { UserRepositoryProvider } from "../user/user.providers";
import { TicketModule } from "./ticket.module";
import {
	TicketRepositoryProvider,
	TicketServiceProvider,
} from "./ticket.providers";
import type { ITicket } from "./ticket.types";

describe("TicketService", () => {
	test("purchases a ticket using a mocked repository provider", async () => {
		const ticket: ITicket = {
			id: "777ae074-bd94-4fd1-a1a0-7be919971e13",
			raffleId: "78bfd313-c266-4a1f-8b58-aa8f62ad31b5",
			userId: "0d80ce5c-dbd9-46bb-bf3b-cc74a19c38ab",
			purchasedAt: new Date("2026-06-01T10:00:00.000Z"),
		};
		const calls: Array<{
			raffleId: string;
			ticketPrice: string;
			userId: string;
		}> = [];
		const ticketRepository = {
			createPurchase: async (input: {
				raffleId: string;
				ticketPrice: string;
				userId: string;
			}) => {
				calls.push(input);
				return ticket;
			},
			findAll: async () => [],
			findRaffleForPurchase: async () => ({
					id: ticket.raffleId,
					maxTickets: 500,
					status: "active" as const,
					ticketPrice: "5.00",
					ticketsSold: 0,
			}),
		};
		const userRepository = {
			findUserForPurchase: async () => ({
					balance: "100.00",
					id: ticket.userId,
			}),
		};

		const resolve = await createApplication(TicketModule, {
			providers: [
				{
					provide: TicketRepositoryProvider,
					value: ticketRepository,
				},
				{
					provide: UserRepositoryProvider,
					value: userRepository,
				},
			],
		});
		const ticketService = resolve(TicketServiceProvider);

		const result = await ticketService.purchaseTicket({
			raffleId: ticket.raffleId,
			userId: ticket.userId,
		});

		expect(result).toEqual(ticket);
		expect(calls).toEqual([
			{
				raffleId: ticket.raffleId,
				ticketPrice: "5.00",
				userId: ticket.userId,
			},
		]);
	});

	test("requires raffle to be active before tickets can be purchased", async () => {
		const ticketRepository = {
			createPurchase: async () => {
				throw new Error("createPurchase should not be called");
			},
			findAll: async () => [],
			findRaffleForPurchase: async () => ({
					id: "78bfd313-c266-4a1f-8b58-aa8f62ad31b5",
					maxTickets: 500,
					status: "draft" as const,
					ticketPrice: "5.00",
					ticketsSold: 0,
			}),
		};
		const userRepository = {
			findUserForPurchase: async () => ({
					balance: "100.00",
					id: "0d80ce5c-dbd9-46bb-bf3b-cc74a19c38ab",
			}),
		};
		const resolve = await createApplication(TicketModule, {
			providers: [
				{
					provide: TicketRepositoryProvider,
					value: ticketRepository,
				},
				{
					provide: UserRepositoryProvider,
					value: userRepository,
				},
			],
		});
		const ticketService = resolve(TicketServiceProvider);

		await expect(
			ticketService.purchaseTicket({
				raffleId: "78bfd313-c266-4a1f-8b58-aa8f62ad31b5",
				userId: "0d80ce5c-dbd9-46bb-bf3b-cc74a19c38ab",
			}),
		).rejects.toThrow(ApiError);
	});

	test("returns an error when purchasing a ticket for a sold out raffle", async () => {
		const ticketRepository = {
			createPurchase: async () => {
				throw new Error("createPurchase should not be called");
			},
			findAll: async () => [],
			findRaffleForPurchase: async () => ({
					id: "78bfd313-c266-4a1f-8b58-aa8f62ad31b5",
					maxTickets: 500,
					status: "active" as const,
					ticketPrice: "5.00",
					ticketsSold: 500,
			}),
		};
		const userRepository = {
			findUserForPurchase: async () => ({
					balance: "100.00",
					id: "0d80ce5c-dbd9-46bb-bf3b-cc74a19c38ab",
			}),
		};
		const resolve = await createApplication(TicketModule, {
			providers: [
				{
					provide: TicketRepositoryProvider,
					value: ticketRepository,
				},
				{
					provide: UserRepositoryProvider,
					value: userRepository,
				},
			],
		});
		const ticketService = resolve(TicketServiceProvider);

		await expect(
			ticketService.purchaseTicket({
				raffleId: "78bfd313-c266-4a1f-8b58-aa8f62ad31b5",
				userId: "0d80ce5c-dbd9-46bb-bf3b-cc74a19c38ab",
			}),
		).rejects.toThrow("Raffle has no tickets available");
	});
});

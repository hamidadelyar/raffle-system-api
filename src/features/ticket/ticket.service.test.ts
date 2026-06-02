import { describe, expect, test } from "bun:test";
import { createApplication } from "difunkt";
import { UserRepositoryProvider } from "../user/user.providers";
import type { PurchaseUser, UserRepository } from "../user/user.repository";
import { TicketModule } from "./ticket.module";
import {
	TicketRepositoryProvider,
	TicketServiceProvider,
} from "./ticket.providers";
import type {
	TicketPurchaseRaffle,
	TicketRepository,
} from "./ticket.repository";
import type { ITicket } from "./ticket.types";

const raffleId = "78bfd313-c266-4a1f-8b58-aa8f62ad31b5";
const userId = "0d80ce5c-dbd9-46bb-bf3b-cc74a19c38ab";

type MockTicketRepository = Pick<
	TicketRepository,
	"createPurchase" | "findAll" | "findRaffleForPurchase"
>;
type MockUserRepository = Pick<UserRepository, "findUser">;
type CreatePurchaseInput = Parameters<
	MockTicketRepository["createPurchase"]
>[0];
type FindAllInput = Parameters<MockTicketRepository["findAll"]>[0];

async function createTicketService({
	ticketRepository,
	userRepository,
}: {
	ticketRepository: MockTicketRepository;
	userRepository: MockUserRepository;
}) {
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

	return resolve(TicketServiceProvider);
}

function createTicket(overrides: Partial<ITicket> = {}): ITicket {
	return {
		id: "777ae074-bd94-4fd1-a1a0-7be919971e13",
		raffleId,
		userId,
		purchasedAt: new Date("2026-06-01T10:00:00.000Z"),
		...overrides,
	};
}

function createPurchaseRaffle(
	overrides: Partial<TicketPurchaseRaffle> = {},
): TicketPurchaseRaffle {
	return {
		id: raffleId,
		maxTickets: 500,
		status: "active",
		ticketPrice: "5.00",
		ticketsSold: 0,
		...overrides,
	};
}

function createPurchaseUser(
	overrides: Partial<PurchaseUser> = {},
): PurchaseUser {
	return {
		balance: "100.00",
		id: userId,
		...overrides,
	};
}

function createMockTicketRepository({
	createPurchaseCalls = [],
	findAllCalls = [],
	raffle = createPurchaseRaffle(),
	purchasedTickets = [createTicket()],
	tickets = [],
}: {
	createPurchaseCalls?: CreatePurchaseInput[];
	findAllCalls?: FindAllInput[];
	raffle?: TicketPurchaseRaffle | null;
	purchasedTickets?: ITicket[];
	tickets?: ITicket[];
} = {}): MockTicketRepository {
	return {
		createPurchase: async (input) => {
			createPurchaseCalls.push(input);
			return purchasedTickets;
		},
		findAll: async (input) => {
			findAllCalls.push(input);
			return tickets;
		},
		findRaffleForPurchase: async () => raffle,
	};
}

function createMockUserRepository(
	user: PurchaseUser | null = createPurchaseUser(),
): MockUserRepository {
	return {
		findUser: async () => user,
	};
}

describe("TicketService", () => {
	test("purchases multiple tickets using a mocked repository provider", async () => {
		const purchasedTickets = [
			createTicket({ id: "777ae074-bd94-4fd1-a1a0-7be919971e13" }),
			createTicket({ id: "777ae074-bd94-4fd1-a1a0-7be919971e14" }),
		];
		const createPurchaseCalls: CreatePurchaseInput[] = [];
		const ticketRepository = createMockTicketRepository({
			createPurchaseCalls,
			purchasedTickets,
		});
		const userRepository = createMockUserRepository();
		const ticketService = await createTicketService({
			ticketRepository,
			userRepository,
		});

		const result = await ticketService.purchaseTickets({
			quantity: 2,
			raffleId,
			userId,
		});

		expect(result).toEqual(purchasedTickets);
		expect(createPurchaseCalls).toEqual([
			{
				quantity: 2,
				raffleId,
				ticketPrice: "5.00",
				userId,
			},
		]);
	});

	const invalidPurchaseCases: Array<{
		name: string;
		raffle?: TicketPurchaseRaffle | null;
		user?: PurchaseUser | null;
		expectedError: string;
	}> = [
		{
			name: "raffle does not exist",
			raffle: null,
			expectedError: "Raffle not found",
		},
		{
			name: "user does not exist",
			user: null,
			expectedError: "User not found",
		},
		{
			name: "raffle is not active",
			raffle: createPurchaseRaffle({ status: "draft" }),
			expectedError: "Raffle is not active",
		},
		{
			name: "raffle is sold out",
			raffle: createPurchaseRaffle({ ticketsSold: 500 }),
			expectedError: "Raffle has no tickets available",
		},
		{
			name: "requested quantity exceeds remaining tickets",
			raffle: createPurchaseRaffle({ maxTickets: 500, ticketsSold: 499 }),
			expectedError: "Raffle has no tickets available",
		},
		{
			name: "user has insufficient balance",
			user: createPurchaseUser({ balance: "9.99" }),
			expectedError: "Insufficient balance",
		},
	];

	for (const { expectedError, name, raffle, user } of invalidPurchaseCases) {
		test(`rejects purchase when ${name}`, async () => {
			const createPurchaseCalls: CreatePurchaseInput[] = [];
			const ticketRepository = createMockTicketRepository({
				createPurchaseCalls,
				raffle,
			});
			const userRepository = createMockUserRepository(user);
			const ticketService = await createTicketService({
				ticketRepository,
				userRepository,
			});

			await expect(
				ticketService.purchaseTickets({ quantity: 2, raffleId, userId }),
			).rejects.toThrow(expectedError);
			expect(createPurchaseCalls).toEqual([]);
		});
	}

	test("lists tickets for a user", async () => {
		const tickets = [createTicket()];
		const findAllCalls: FindAllInput[] = [];
		const ticketRepository = createMockTicketRepository({
			findAllCalls,
			tickets,
		});
		const userRepository = createMockUserRepository();
		const ticketService = await createTicketService({
			ticketRepository,
			userRepository,
		});

		const result = await ticketService.listTickets({ userId });

		expect(result).toEqual(tickets);
		expect(findAllCalls).toEqual([{ userId }]);
	});
});

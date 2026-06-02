import { env } from "../config/env";
import { createLogger } from "../plugins/logger.plugin";
import { createDatabaseClient } from "./create-db-client";
import { prizes, raffles, tickets, users } from "./schema";

const log = createLogger("Seed");
const db = createDatabaseClient(env);
const now = new Date();

function minutesFromNow(minutes: number) {
	return new Date(now.getTime() + minutes * 60 * 1000);
}

const seedUsers = [
	{
		id: "0d80ce5c-dbd9-46bb-bf3b-cc74a19c38ab",
		email: "hamidadelyar@gmail.com",
		name: "Hamid Adelyar",
		balance: "100.00",
	},
	{
		id: "55d20737-a618-4b56-9a10-60f2bb857cb5",
		email: "johnsmith@gmail.com",
		name: "John Smith",
		balance: "250.00",
	},
];

const seedPrizes = [
	{
		id: "1d72398b-2a2c-493b-8c21-1d155dfc6f5e",
		name: "PlayStation 5",
		description: "Sony PlayStation 5 console",
		value: "479.99",
		imageUrl: null,
	},
	{
		id: "eaf7a5ea-c5fa-4521-b1e3-bc3160d793f5",
		name: "Apple Watch",
		description: "Apple Watch Series 10",
		value: "399.00",
		imageUrl: null,
	},
	{
		id: "ae12b05a-8d06-4d2f-9af2-4c20eaa45691",
		name: "Nintendo Switch 2",
		description: "Nintendo Switch 2 console",
		value: "399.99",
		imageUrl: null,
	},
];

const seedRaffles = [
	{
		id: "78bfd313-c266-4a1f-8b58-aa8f62ad31b5",
		name: "PS5 Raffle",
		description: "Win a brand new PlayStation 5",
		prizeId: seedPrizes[0].id,
		ticketPrice: "5.00",
		maxTickets: 500,
		drawDate: new Date("2026-07-01T19:00:00.000Z"),
		status: "active" as const,
		winnerId: null,
	},
	{
		id: "08a186c3-4780-4e6f-92c1-0e034318e7a3",
		name: "Apple Watch Raffle",
		description: "Win an Apple Watch Series 10",
		prizeId: seedPrizes[1].id,
		ticketPrice: "3.00",
		maxTickets: 300,
		drawDate: new Date("2026-06-15T19:00:00.000Z"),
		status: "drawn" as const,
		winnerId: seedUsers[1].id,
	},
	{
		id: "20ef436f-407c-4fbb-bf6d-bbb646cb6c90",
		name: "One Minute Draw Raffle",
		description: "Draws one minute after seeding",
		prizeId: seedPrizes[2].id,
		ticketPrice: "2.00",
		maxTickets: 100,
		drawDate: minutesFromNow(1),
		status: "active" as const,
		winnerId: null,
	},
	{
		id: "d34ac858-b861-49c1-9670-9fa2b9acc201",
		name: "Two Minute Draw Raffle",
		description: "Draws two minutes after seeding",
		prizeId: seedPrizes[0].id,
		ticketPrice: "2.00",
		maxTickets: 100,
		drawDate: minutesFromNow(2),
		status: "active" as const,
		winnerId: null,
	},
	{
		id: "854c8d65-3fcb-4b6e-88e5-d75f63067b16",
		name: "Three Minute Draw Raffle",
		description: "Draws three minutes after seeding",
		prizeId: seedPrizes[1].id,
		ticketPrice: "2.00",
		maxTickets: 100,
		drawDate: minutesFromNow(3),
		status: "active" as const,
		winnerId: null,
	},
];

const seedTickets = [
	{
		id: "777ae074-bd94-4fd1-a1a0-7be919971e13",
		raffleId: seedRaffles[0].id,
		userId: seedUsers[0].id,
		purchasedAt: new Date("2026-06-01T10:00:00.000Z"),
	},
	{
		id: "653d133a-7115-4da3-87b0-a7ce2857d1d4",
		raffleId: seedRaffles[0].id,
		userId: seedUsers[0].id,
		purchasedAt: new Date("2026-06-01T10:05:00.000Z"),
	},
	{
		id: "f34efbc3-aa8b-4318-9ea3-cd283a7e6173",
		raffleId: seedRaffles[0].id,
		userId: seedUsers[1].id,
		purchasedAt: new Date("2026-06-01T10:10:00.000Z"),
	},
	{
		id: "476d205b-31ad-49ef-83b2-89fe326ef74f",
		raffleId: seedRaffles[1].id,
		userId: seedUsers[0].id,
		purchasedAt: new Date("2026-06-01T11:00:00.000Z"),
	},
	{
		id: "43a51486-c7ea-41ee-9851-87fd9765cd1b",
		raffleId: seedRaffles[1].id,
		userId: seedUsers[1].id,
		purchasedAt: new Date("2026-06-01T11:05:00.000Z"),
	},
	{
		id: "8d3c17ef-2970-42f5-91ab-4c79d7653435",
		raffleId: seedRaffles[2].id,
		userId: seedUsers[0].id,
		purchasedAt: now,
	},
	{
		id: "c8d4888d-b830-4b65-bf16-11a9b236963a",
		raffleId: seedRaffles[3].id,
		userId: seedUsers[1].id,
		purchasedAt: now,
	},
	{
		id: "c63858a6-8b8d-4b72-9692-4ac9be7691cc",
		raffleId: seedRaffles[4].id,
		userId: seedUsers[0].id,
		purchasedAt: now,
	},
];

for (const user of seedUsers) {
	await db
		.insert(users)
		.values(user)
		.onConflictDoUpdate({
			target: users.email,
			set: {
				name: user.name,
				balance: user.balance,
				updatedAt: new Date(),
			},
		});
}

for (const prize of seedPrizes) {
	await db
		.insert(prizes)
		.values(prize)
		.onConflictDoUpdate({
			target: prizes.id,
			set: {
				name: prize.name,
				description: prize.description,
				value: prize.value,
				imageUrl: prize.imageUrl,
				updatedAt: new Date(),
			},
		});
}

for (const raffle of seedRaffles) {
	const ticketsSold = seedTickets.filter(
		(ticket) => ticket.raffleId === raffle.id,
	).length;

	await db
		.insert(raffles)
		.values({
			...raffle,
			ticketsSold,
		})
		.onConflictDoUpdate({
			target: raffles.id,
			set: {
				name: raffle.name,
				description: raffle.description,
				prizeId: raffle.prizeId,
				ticketPrice: raffle.ticketPrice,
				maxTickets: raffle.maxTickets,
				ticketsSold,
				drawDate: raffle.drawDate,
				status: raffle.status,
				winnerId: raffle.winnerId,
				updatedAt: new Date(),
			},
		});
}

for (const ticket of seedTickets) {
	await db
		.insert(tickets)
		.values(ticket)
		.onConflictDoUpdate({
			target: tickets.id,
			set: {
				raffleId: ticket.raffleId,
				userId: ticket.userId,
				purchasedAt: ticket.purchasedAt,
			},
		});
}

log.info("Database seeded");

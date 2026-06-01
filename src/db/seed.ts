import { env } from "../config/env";
import { createDatabaseClient } from "./create-db-client";
import { prizes, raffles, tickets, users } from "./schema";

const db = createDatabaseClient(env);

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

console.log("Database seeded");

ALTER TABLE "raffles" ADD CONSTRAINT "raffles_ticket_price_positive" CHECK ("raffles"."ticket_price" > 0);--> statement-breakpoint
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_max_tickets_positive" CHECK ("raffles"."max_tickets" > 0);--> statement-breakpoint
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_tickets_sold_non_negative" CHECK ("raffles"."tickets_sold" >= 0);--> statement-breakpoint
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_tickets_sold_not_above_max" CHECK ("raffles"."tickets_sold" <= "raffles"."max_tickets");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_balance_non_negative" CHECK ("users"."balance" >= 0);
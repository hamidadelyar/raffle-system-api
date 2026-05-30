CREATE TYPE "public"."raffle_status" AS ENUM('draft', 'active', 'drawn', 'cancelled');--> statement-breakpoint
CREATE TABLE "prizes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "raffles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"prize_id" uuid NOT NULL,
	"ticket_price" numeric(10, 2) NOT NULL,
	"max_tickets" integer NOT NULL,
	"tickets_sold" integer DEFAULT 0 NOT NULL,
	"draw_date" timestamp with time zone NOT NULL,
	"status" "raffle_status" DEFAULT 'draft' NOT NULL,
	"winner_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_prize_id_prizes_id_fk" FOREIGN KEY ("prize_id") REFERENCES "public"."prizes"("id") ON DELETE no action ON UPDATE no action;
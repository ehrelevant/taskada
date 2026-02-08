CREATE TYPE "public"."request_status" AS ENUM('pending', 'settling');--> statement-breakpoint
ALTER TABLE "app"."booking" DROP CONSTRAINT "booking_request_id_request_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."booking" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app"."booking" ALTER COLUMN "status" SET DEFAULT 'in_transit'::text;--> statement-breakpoint
DROP TYPE "public"."booking_status";--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('in_transit', 'serving', 'completed', 'cancelled');--> statement-breakpoint
ALTER TABLE "app"."booking" ALTER COLUMN "status" SET DEFAULT 'in_transit'::"public"."booking_status";--> statement-breakpoint
ALTER TABLE "app"."booking" ALTER COLUMN "status" SET DATA TYPE "public"."booking_status" USING "status"::"public"."booking_status";--> statement-breakpoint
ALTER TABLE "app"."request" ADD COLUMN "status" "request_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."booking" DROP COLUMN "request_id";
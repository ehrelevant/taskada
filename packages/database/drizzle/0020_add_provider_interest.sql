CREATE TYPE "public"."interest_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TABLE "app"."provider_interest" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"status" "interest_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."provider_interest" ADD CONSTRAINT "provider_interest_request_id_request_id_fk" FOREIGN KEY ("request_id") REFERENCES "app"."request"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."provider_interest" ADD CONSTRAINT "provider_interest_provider_id_provider_user_id_fk" FOREIGN KEY ("provider_id") REFERENCES "app"."provider"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."provider_interest" ADD CONSTRAINT "provider_interest_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "app"."service"("id") ON DELETE cascade ON UPDATE cascade;
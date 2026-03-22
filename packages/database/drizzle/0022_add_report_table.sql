CREATE TYPE "public"."report_reason" AS ENUM('harassment', 'fraudulent_payment', 'unfair_cancellation', 'no_show', 'inappropriate_behavior', 'poor_service', 'other');--> statement-breakpoint
CREATE TABLE "app"."report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_user_id" uuid NOT NULL,
	"reported_user_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"reason" "report_reason" NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "report_unique_reporter_booking" UNIQUE("reporter_user_id","booking_id")
);
--> statement-breakpoint
CREATE TABLE "app"."report_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."report" ADD CONSTRAINT "report_reporter_user_id_user_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."report" ADD CONSTRAINT "report_reported_user_id_user_id_fk" FOREIGN KEY ("reported_user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."report" ADD CONSTRAINT "report_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "app"."booking"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."report_image" ADD CONSTRAINT "report_image_report_id_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "app"."report"("id") ON DELETE cascade ON UPDATE cascade;
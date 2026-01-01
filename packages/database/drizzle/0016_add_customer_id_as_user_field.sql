ALTER TABLE "app"."user" ADD COLUMN "xendit_customer_id" text;--> statement-breakpoint
ALTER TABLE "app"."user" ADD CONSTRAINT "user_xendit_customer_id_unique" UNIQUE("xendit_customer_id");
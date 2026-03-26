CREATE TABLE "app"."xendit_details" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."xendit_details" ADD CONSTRAINT "xendit_details_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."payment_method" DROP COLUMN "payment_token";
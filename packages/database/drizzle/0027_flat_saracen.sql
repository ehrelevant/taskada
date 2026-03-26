ALTER TABLE "app"."payment_audit_log" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "app"."payment_audit_log" ADD COLUMN "external_id" text NOT NULL;
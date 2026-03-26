CREATE TYPE "public"."payment_audit_log_types" AS ENUM('SESSION_SAVE', 'SESSION_PAY', 'PAYMENT');--> statement-breakpoint
CREATE TABLE "app"."payment_audit_log" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "payment_audit_log_types" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

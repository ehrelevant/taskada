CREATE TYPE "public"."audit_action" AS ENUM('created', 'status_changed', 'assigned', 'note_added', 'resolved', 'dismissed', 'evidence_reviewed');--> statement-breakpoint
CREATE TYPE "public"."ban_status" AS ENUM('active', 'suspended', 'banned');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('open', 'under_review', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TABLE "app"."audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"moderator_id" uuid NOT NULL,
	"action" "audit_action" NOT NULL,
	"details" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."moderation_note" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."report" ADD COLUMN "status" "report_status" DEFAULT 'open' NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."report" ADD COLUMN "resolved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "app"."report" ADD COLUMN "resolved_by" uuid;--> statement-breakpoint
ALTER TABLE "app"."user" ADD COLUMN "ban_status" "ban_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."user" ADD COLUMN "warnings_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."user" ADD COLUMN "suspended_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "app"."audit_log" ADD CONSTRAINT "audit_log_report_id_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "app"."report"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."audit_log" ADD CONSTRAINT "audit_log_moderator_id_user_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."moderation_note" ADD CONSTRAINT "moderation_note_report_id_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "app"."report"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."moderation_note" ADD CONSTRAINT "moderation_note_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."report" ADD CONSTRAINT "report_resolved_by_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "app"."user"("id") ON DELETE set null ON UPDATE cascade;
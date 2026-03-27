CREATE SCHEMA "app";
--> statement-breakpoint
CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('in_transit', 'serving', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."interest_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."payment_audit_log_types" AS ENUM('SESSION_SAVE', 'SESSION_PAY', 'PAYMENT');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('pending', 'settling');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('provider', 'seeker', 'admin');--> statement-breakpoint
CREATE TYPE "public"."ban_status" AS ENUM('active', 'suspended', 'banned');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('created', 'status_changed', 'assigned', 'note_added', 'resolved', 'dismissed', 'evidence_reviewed');--> statement-breakpoint
CREATE TYPE "public"."report_reason" AS ENUM('harassment', 'fraudulent_payment', 'unfair_cancellation', 'no_show', 'inappropriate_behavior', 'poor_service', 'other');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('open', 'under_review', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TABLE "app"."address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text,
	"coordinates" "geography" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."agency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"avatar_url" text
);
--> statement-breakpoint
CREATE TABLE "auth"."account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider_id" text NOT NULL,
	"account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "auth"."verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"seeker_id" uuid NOT NULL,
	"status" "booking_status" DEFAULT 'in_transit' NOT NULL,
	"cost" numeric(10, 2) DEFAULT 0 NOT NULL,
	"specifications" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "app"."message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."message_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" uuid NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."payment_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "payment_audit_log_types" NOT NULL,
	"external_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."payment_method" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"channel_code" text NOT NULL,
	"external_id" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."portfolio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "app"."portfolio_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."provider" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"agency_id" uuid,
	"is_accepting" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_type_id" uuid NOT NULL,
	"service_id" uuid,
	"seeker_id" uuid NOT NULL,
	"address_id" uuid NOT NULL,
	"description" text,
	"status" "request_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."request_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"reviewer_user_id" uuid NOT NULL,
	"rating" integer,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "review_rating_range" CHECK ("app"."review"."rating" IS NULL OR "app"."review"."rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "app"."review_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."seeker" (
	"user_id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_type_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"initial_cost" numeric(10, 2) DEFAULT 0 NOT NULL,
	"is_enabled" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."service_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon_url" text
);
--> statement-breakpoint
CREATE TABLE "app"."push_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"platform" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"first_name" text DEFAULT '' NOT NULL,
	"middle_name" text DEFAULT '' NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"phone_number" text NOT NULL,
	"avatar_url" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"xendit_customer_id" text,
	"ban_status" "ban_status" DEFAULT 'active' NOT NULL,
	"warnings_count" integer DEFAULT 0 NOT NULL,
	"suspended_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "user_xendit_customer_id_unique" UNIQUE("xendit_customer_id"),
	CONSTRAINT "user_email_non_empty" CHECK ("app"."user"."email" <> ''),
	CONSTRAINT "user_phone_number_non_empty" CHECK ("app"."user"."phone_number" <> '')
);
--> statement-breakpoint
CREATE TABLE "app"."user_role" (
	"user_id" uuid NOT NULL,
	"role" "role" NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_role_user_id_role_pk" PRIMARY KEY("user_id","role")
);
--> statement-breakpoint
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
CREATE TABLE "app"."report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_user_id" uuid NOT NULL,
	"reported_user_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"reason" "report_reason" NOT NULL,
	"description" text,
	"status" "report_status" DEFAULT 'open' NOT NULL,
	"resolved_at" timestamp with time zone,
	"resolved_by" uuid,
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
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."booking" ADD CONSTRAINT "booking_provider_id_provider_user_id_fk" FOREIGN KEY ("provider_id") REFERENCES "app"."provider"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."booking" ADD CONSTRAINT "booking_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "app"."service"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."booking" ADD CONSTRAINT "booking_seeker_id_seeker_user_id_fk" FOREIGN KEY ("seeker_id") REFERENCES "app"."seeker"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."provider_interest" ADD CONSTRAINT "provider_interest_request_id_request_id_fk" FOREIGN KEY ("request_id") REFERENCES "app"."request"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."provider_interest" ADD CONSTRAINT "provider_interest_provider_id_provider_user_id_fk" FOREIGN KEY ("provider_id") REFERENCES "app"."provider"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."provider_interest" ADD CONSTRAINT "provider_interest_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "app"."service"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."message" ADD CONSTRAINT "message_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "app"."booking"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."message" ADD CONSTRAINT "message_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."message_image" ADD CONSTRAINT "message_image_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "app"."message"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."payment_audit_log" ADD CONSTRAINT "payment_audit_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."payment_method" ADD CONSTRAINT "payment_method_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."portfolio" ADD CONSTRAINT "portfolio_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "app"."service"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."portfolio_image" ADD CONSTRAINT "portfolio_image_portfolio_id_portfolio_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "app"."portfolio"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."provider" ADD CONSTRAINT "provider_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."provider" ADD CONSTRAINT "provider_agency_id_agency_id_fk" FOREIGN KEY ("agency_id") REFERENCES "app"."agency"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."request" ADD CONSTRAINT "request_service_type_id_service_type_id_fk" FOREIGN KEY ("service_type_id") REFERENCES "app"."service_type"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."request" ADD CONSTRAINT "request_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "app"."service"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."request" ADD CONSTRAINT "request_seeker_id_seeker_user_id_fk" FOREIGN KEY ("seeker_id") REFERENCES "app"."seeker"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."request" ADD CONSTRAINT "request_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "app"."address"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."request_image" ADD CONSTRAINT "request_image_request_id_request_id_fk" FOREIGN KEY ("request_id") REFERENCES "app"."request"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."review" ADD CONSTRAINT "review_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "app"."service"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."review" ADD CONSTRAINT "review_reviewer_user_id_user_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."review_image" ADD CONSTRAINT "review_image_review_id_review_id_fk" FOREIGN KEY ("review_id") REFERENCES "app"."review"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."seeker" ADD CONSTRAINT "seeker_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."service" ADD CONSTRAINT "service_service_type_id_service_type_id_fk" FOREIGN KEY ("service_type_id") REFERENCES "app"."service_type"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."service" ADD CONSTRAINT "service_provider_id_provider_user_id_fk" FOREIGN KEY ("provider_id") REFERENCES "app"."provider"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."push_token" ADD CONSTRAINT "push_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."audit_log" ADD CONSTRAINT "audit_log_report_id_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "app"."report"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."audit_log" ADD CONSTRAINT "audit_log_moderator_id_user_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."moderation_note" ADD CONSTRAINT "moderation_note_report_id_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "app"."report"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."moderation_note" ADD CONSTRAINT "moderation_note_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."report" ADD CONSTRAINT "report_reporter_user_id_user_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."report" ADD CONSTRAINT "report_reported_user_id_user_id_fk" FOREIGN KEY ("reported_user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."report" ADD CONSTRAINT "report_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "app"."booking"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."report" ADD CONSTRAINT "report_resolved_by_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "app"."user"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."report_image" ADD CONSTRAINT "report_image_report_id_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "app"."report"("id") ON DELETE cascade ON UPDATE cascade;
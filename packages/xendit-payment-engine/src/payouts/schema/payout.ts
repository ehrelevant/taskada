import * as v from "valibot";
import { MetadataSchema } from "@standard/schema";

export const PayoutSchema = v.pipe(
    v.object({
        id: v.pipe(
            v.string(),
            v.minLength(29),
            v.maxLength(29),
            v.metadata({ example: "disb-571f3644d2b4edf0745e9703" }),
            v.description("Xendit-generated unique identifier for each payout."),
        ),
        amount: v.pipe(
            v.number(),
            v.minValue(0),
            v.metadata({ example: 10000.0 }),
            v.description("Amount to be sent to the destination account."),
        ),
        channel_code: v.pipe(
            v.string(),
            v.metadata({ example: "ID_BCA" }),
            v.description("Channel code of destination bank, E-Wallet or OTC channel."),
        ),
        currency: v.pipe(v.string(), v.description("ISO 4217 Currency Code.")),
        reference_id: v.pipe(
            v.string(),
            v.minLength(1),
            v.maxLength(255),
            v.metadata({ example: "myref-1482928194" }),
            v.description("A reference to uniquely identify the Payout."),
        ),
        status: v.pipe(
            v.picklist(["ACCEPTED", "REQUESTED", "FAILED", "SUCCEEDED", "CANCELLED", "REVERSED"]),
            v.description("Status of the payout."),
        ),
        created: v.pipe(
            v.string(),
            v.isoTimestamp(),
            v.description("Timestamp when the payout request was made (ISO 8601)."),
        ),
        updated: v.pipe(
            v.string(),
            v.isoTimestamp(),
            v.description("Timestamp when the payout request was updated (ISO 8601)."),
        ),
        estimated_arrival_time: v.optional(
            v.pipe(
                v.string(),
                v.isoTimestamp(),
                v.description("Estimated time of arrival of funds in destination account (ISO 8601)."),
            ),
        ),
        failure_code: v.optional(
            v.pipe(
                v.picklist([
                    "INSUFFICIENT_BALANCE",
                    "INVALID_DESTINATION",
                    "REJECTED_BY_CHANNEL",
                    "TEMPORARY_TRANSFER_ERROR",
                    "TRANSFER_ERROR",
                    "UNKNOWN_BANK_NETWORK_ERROR",
                    "DESTINATION_MAXIMUM_LIMIT",
                ]),
                v.description("Failure code when the payout failed."),
            ),
        ),
        business_id: v.optional(v.pipe(v.string(), v.description("Your Xendit Business ID."))),
        channel_properties: v.optional(
            v.pipe(
                v.object({
                    account_holder_name: v.optional(
                        v.pipe(
                            v.string(),
                            v.minLength(1),
                            v.maxLength(100),
                            v.description("Name of account holder as per the bank or E-Wallet's records."),
                        ),
                    ),
                    account_number: v.optional(
                        v.pipe(
                            v.string(),
                            v.minLength(1),
                            v.maxLength(100),
                            v.description("Account number of destination. Mobile numbers for E-Wallet accounts."),
                        ),
                    ),
                    account_type: v.optional(v.pipe(v.string(), v.description("Account type of the destination."))),
                }),
                v.description("Channel properties object (destination account details)."),
            ),
        ),
        receipt_notification: v.optional(
            v.pipe(
                v.object({
                    email_to: v.optional(v.array(v.pipe(v.string(), v.email()))),
                    email_cc: v.optional(v.array(v.pipe(v.string(), v.email()))),
                    email_bcc: v.optional(v.array(v.pipe(v.string(), v.email()))),
                }),
                v.description("Object containing email addresses to receive payout details upon successful Payout."),
            ),
        ),
        metadata: MetadataSchema,
    }),
    v.description("Payout object."),
);

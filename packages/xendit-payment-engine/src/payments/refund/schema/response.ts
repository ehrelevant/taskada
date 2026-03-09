import * as v from "valibot";

export const CreateRefundResponseSchema = v.object({
    id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description("Xendit unique Refund ID generated as reference after creation of refund."),
    ),
    payment_request_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description("Xendit unique Payment Request ID generated as reference after creation of payment request."),
    ),
    payment_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description("To be deprecated. Xendit unique Payment ID generated as reference for a payment."),
    ),
    invoice_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description(
            "To be deprecated. Xendit unique Invoice ID generated as reference after creation of an invoice or payment link.",
        ),
    ),
    payment_method_type: v.pipe(
        v.string(),
        v.picklist(["CARD", "EWALLET", "DIRECT_DEBIT"]),
        v.description("To be deprecated. Type of the payment method used in the original payment."),
    ),
    reference_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description("A Reference ID from merchants to identify their request."),
    ),
    channel_code: v.pipe(v.string(), v.description("Channel code used to select the payment method provider.")),
    currency: v.pipe(
        v.string(),
        v.picklist(["IDR", "PHP", "VND", "THB", "SGD", "MYR", "USD", "HKD", "AUD", "GBP", "EUR", "JPY", "MXN"]),
        v.description("ISO 4217 three-letter currency code for the payment."),
    ),
    amount: v.pipe(
        v.number(),
        v.minValue(0),
        v.description("The intended payment amount to be refunded to the end user."),
    ),
    status: v.pipe(
        v.string(),
        v.picklist(["SUCCEEDED", "FAILED", "PENDING", "CANCELLED"]),
        v.description("Status of the refund."),
    ),
    reason: v.pipe(
        v.string(),
        v.picklist(["FRAUDULENT", "DUPLICATE", "REQUESTED_BY_CUSTOMER", "CANCELLATION", "OTHERS"]),
        v.description("Status of the refund."),
    ),
    failure_code: v.optional(
        v.pipe(
            v.string(),
            v.picklist([
                "ACCOUNT_ACCESS_BLOCKED",
                "ACCOUNT_NOT_FOUND",
                "DUPLICATE_ERROR",
                "INSUFFICIENT_BALANCE",
                "REFUND_FAILED",
            ]),
            v.description("Reasons of the refund failure."),
        ),
    ),
    refund_fee_amount: v.pipe(v.number(), v.description("Fee for processing the refund.")),
    metadata: v.record(
        v.pipe(v.string(), v.maxLength(40), v.description("Custom key name, up to 40 chars.")),
        v.pipe(v.string(), v.maxLength(500), v.description("Custom value, up to 500 chars.")),
    ),
    created: v.pipe(v.string(), v.isoTimestamp(), v.description("ISO 8601 date-time format.")),
    updated: v.pipe(v.string(), v.isoTimestamp(), v.description("ISO 8601 date-time format.")),
});

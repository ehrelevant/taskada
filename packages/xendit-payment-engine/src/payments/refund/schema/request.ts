import * as v from "valibot";

export const CreateRefundRequestSchema = v.object({
    payment_request_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description(
            "Xendit unique Payment Request ID generated as reference after creation of payment request. Example: pr-1102feb0-bb79-47ae-9d1e-e69394d3949c",
        ),
    ),
    reference_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description("A Reference ID from merchants to identify their request."),
    ),
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
    reason: v.pipe(
        v.string(),
        v.picklist(["FRAUDULENT", "DUPLICATE", "REQUESTED_BY_CUSTOMER", "CANCELLATION", "OTHERS"]),
        v.description("Status of the refund."),
    ),
    metadata: v.optional(
        v.record(
            v.pipe(v.string(), v.maxLength(40), v.description("Custom key name, up to 40 chars.")),
            v.pipe(v.string(), v.maxLength(500), v.description("Custom value, up to 500 chars.")),
        ),
    ),
});

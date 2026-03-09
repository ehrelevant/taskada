import * as v from "valibot";

import { CaptureSchema } from "./captures";

export const PaymentSchema = v.object({
    payment_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description(
            "Xendit unique Payment ID generated as reference for a payment. Example: py-1402feb0-bb79-47ae-9d1e-e69394d3949c",
        ),
    ),
    business_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description(
            "Xendit-generated identifier for the business that owns the transaction. Example: 5f27a14a9bf05c73dd040bc8",
        ),
    ),
    reference_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description("A Reference ID from merchants to identify their request."),
    ),
    payment_request_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description(
            "Xendit unique Payment Request ID generated as reference after creation of payment request. Example: pr-1102feb0-bb79-47ae-9d1e-e69394d3949c",
        ),
    ),
    payment_token_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description(
            "Xendit unique Payment Token ID generated as reference for reusable payment details of the end user. Example: pr-1102feb0-bb79-47ae-9d1e-e69394d3949c",
        ),
    ),
    customer_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(41),
        v.description(
            "Xendit unique Capture ID generated as reference for the end user. Example: cust-b98d6f63-d240-44ec-9bd5-aa42954c4f48",
        ),
    ),
    type: v.pipe(
        v.string(),
        v.picklist(["PAY", "PAY_AND_SAVE", "REUSABLE_PAYMENT_CODE"]),
        v.description("Payment collection intent type for the payment request."),
    ),
    country: v.pipe(
        v.string(),
        v.picklist(["ID", "PH", "VN", "TH", "SG", "MY", "HK", "MX"]),
        v.description("ISO 3166-1 alpha-2 two-letter country code for the country of transaction."),
    ),
    currency: v.pipe(
        v.string(),
        v.picklist(["IDR", "PHP", "VND", "THB", "SGD", "MYR", "USD", "HKD", "AUD", "GBP", "EUR", "JPY", "MXN"]),
        v.description("ISO 4217 three-letter currency code for the payment."),
    ),
    request_amount: v.pipe(
        v.number(),
        v.minValue(0),
        v.description("The intended payment amount to be collected from the end user."),
    ),
    capture_method: v.pipe(v.string(), v.picklist(["AUTOMATIC", "MANUAL"]), v.description("Payment capture method.")),
    channel_code: v.pipe(v.string(), v.description("Channel code used to select the payment method provider.")),
    captures: v.optional(v.array(CaptureSchema)),
    status: v.pipe(
        v.string(),
        v.picklist(["AUTHORIZED", "CANCELED", "SUCCEEDED", "FAILED", "EXPIRED", "PENDING"]),
        v.description("Status of the payment."),
    ),
    failure_code: v.optional(
        v.pipe(
            v.string(),
            v.picklist([
                "ACCOUNT_ACCESS_BLOCKED",
                "INVALID_MERCHANT_SETTINGS",
                "INVALID_ACCOUNT_DETAILS",
                "PAYMENT_ATTEMPT_COUNTS_EXCEEDED",
                "USER_DEVICE_UNREACHABLE",
                "CHANNEL_UNAVAILABLE",
                "INSUFFICIENT_BALANCE",
                "ACCOUNT_NOT_ACTIVATED",
                "INVALID_TOKEN",
                "SERVER_ERROR",
                "PARTNER_TIMEOUT_ERROR",
                "TIMEOUT_ERROR",
                "USER_DECLINED_PAYMENT",
                "USER_DID_NOT_AUTHORIZE",
                "PAYMENT_REQUEST_EXPIRED",
                "FAILURE_DETAILS_UNAVAILABLE",
                "EXPIRED_OTP",
                "PAYMENT_AMOUNT_LIMITS_EXCEEDED",
                "OTP_ATTEMPT_COUNTS_EXCEEDED",
                "CARD_DECLINED",
                "DECLINED_BY_ISSUER",
                "ISSUER_UNAVAILABLE",
                "INVALID_CVV",
                "DECLINED_BY_PROCESSOR",
                "CAPTURE_AMOUNT_EXCEEDED",
                "AUTHENTICATION_FAILED",
                "PROCESSOR_ERROR",
                "EXPIRED_CARD",
                "INACTIVE_OR_UNAUTHORIZED_CARD",
                "INVALID_MERCHANT_CREDENTIALS",
                "SUCCEEDED_FRAUDULENT",
            ]),
            v.description("Failure codes for payments."),
        ),
    ),
    metadata: v.record(
        v.pipe(v.string(), v.maxLength(40), v.description("Custom key name, up to 40 chars.")),
        v.pipe(v.string(), v.maxLength(500), v.description("Custom value, up to 500 chars.")),
    ),
    created: v.pipe(v.string(), v.isoTimestamp(), v.description("ISO 8601 date-time format.")),
    updated: v.pipe(v.string(), v.isoTimestamp(), v.description("ISO 8601 date-time format.")),
    payment_details: v.optional(v.object({})), // Placeholder, as details depend on payment method
});

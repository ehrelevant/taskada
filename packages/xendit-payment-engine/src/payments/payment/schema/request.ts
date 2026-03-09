import * as v from "valibot";

const PaymentIdRequestSchema = v.object({
    payment_id: v.pipe(
        v.string(),
        v.regex(/^[a-zA-Z0-9-]{39}$/),
        v.metadata({ example: "py-cc3938dc-c2a5-43c4-89d7-7570793348c2" }),
    ),
});

export const GetPaymentStatusRequestSchema = PaymentIdRequestSchema;
export const CapturePaymentRequestSchema = v.object({
    capture_amount: v.pipe(
        v.number(),
        v.description(
            "The payment amount captured for this payment. Maximum capture amount can only be equal or lesser than the authorized amount value.",
        ),
        v.metadata({ example: 10000.0 }),
    ),
    ...PaymentIdRequestSchema.entries,
});
export const CancelPaymentRequestSchema = PaymentIdRequestSchema;

import * as v from "valibot";

export const CaptureSchema = v.object({
    capture_timestamp: v.pipe(v.string(), v.isoTimestamp(), v.description("ISO 8601 date-time format.")),
    capture_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.metadata({ example: "cap-1502feb0-bb79-47ae-9d1e-e69394d3949c" }),
        v.description("Xendit unique Capture ID generated as reference for a single capture."),
    ),
    capture_amount: v.pipe(
        v.number(),
        v.minValue(0),
        v.metadata({ example: 10000.0 }),
        v.description(
            "The payment amount captured for this payment. Maximum capture amount can only be equal or lesser than the authorized amount value.",
        ),
    ),
});

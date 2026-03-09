import * as v from "valibot";
import defaultClient from "@src/client";
import { handle_error } from "@src/standard";

import {
    CancelPaymentRequestSchema,
    CancelPaymentResponseSchema,
    CapturePaymentRequestSchema,
    CapturePaymentResponseSchema,
    GetPaymentStatusRequestSchema,
    GetPaymentStatusResponseSchema,
} from "./schema";
import type {
    CancelPaymentResponse,
    CancelPaymentStatusRequest,
    CapturePaymentRequest,
    CapturePaymentResponse,
    GetPaymentStatusRequest,
    GetPaymentStatusResponse,
} from "./types";

const client = defaultClient.create({
    headers: {
        "api-version": "2024-11-11",
    },
});

export async function capture_payment(request: CapturePaymentRequest): Promise<CapturePaymentResponse> {
    const validated_request = v.parse(CapturePaymentRequestSchema, request);

    const { capture_amount } = validated_request;
    const response = await client.post(`v3/payments/${validated_request.payment_id}/capture`, {
        body: JSON.stringify({ capture_amount }),
    });

    await handle_error(response);

    return v.parse(CapturePaymentResponseSchema, await response.json());
}

export async function cancel_payment(request: CancelPaymentStatusRequest): Promise<CancelPaymentResponse> {
    const validated_request = v.parse(CancelPaymentRequestSchema, request);
    const response = await client.post(`v3/payments/${validated_request.payment_id}/cancel`);

    await handle_error(response);

    return v.parse(CancelPaymentResponseSchema, await response.json());
}

export async function get_payment_status(request: GetPaymentStatusRequest): Promise<GetPaymentStatusResponse> {
    const validated_request = v.parse(GetPaymentStatusRequestSchema, request);

    const response = await client.get(`v3/payments/${validated_request.payment_id}`);

    await handle_error(response);

    return v.parse(GetPaymentStatusResponseSchema, await response.json());
}

import * as v from "valibot";
import client from "@src/client";
import { handle_error } from "@src/standard";
import { v4 as uuid4 } from "uuid";

import type {
    CancelPayoutRequest,
    CancelPayoutResponse,
    CreatePayoutRequest,
    CreatePayoutResponse,
    GetPaymentChannelsRequest,
    GetPaymentChannelsResponse,
    GetPayoutRequest,
    GetPayoutResponse,
    ListPayoutsRequest,
    ListPayoutsResponse,
} from "./types";
import {
    CancelPayoutRequestSchema,
    CancelPayoutResponseSchema,
    CreatePayoutRequestSchema,
    CreatePayoutResponseSchema,
    GetPaymentChannelsRequestSchema,
    GetPaymentChannelsResponseSchema,
    GetPayoutRequestSchema,
    GetPayoutResponseSchema,
    ListPayoutsRequestSchema,
    ListPayoutsResponseSchema,
} from "./schema";

async function create_payout(request: CreatePayoutRequest): Promise<CreatePayoutResponse> {
    const validated_request = v.parse(CreatePayoutRequestSchema, request);
    const response = await client.post(`v2/payouts`, {
        body: JSON.stringify(validated_request),
        headers: { "idempotency-key": uuid4() },
    });

    await handle_error(response, "Failed to create payout");

    return v.parse(CreatePayoutResponseSchema, await response.json());
}

async function get_payout(request: GetPayoutRequest): Promise<GetPayoutResponse> {
    const validated_request = v.parse(GetPayoutRequestSchema, request);
    const response = await client.get(`v2/payouts/${validated_request.payout_id}`);

    await handle_error(response, "Failed to retrieve payout");

    return v.parse(GetPayoutResponseSchema, await response.json());
}

async function get_payout_by_reference_id(request: ListPayoutsRequest): Promise<ListPayoutsResponse> {
    const validated_request = v.parse(ListPayoutsRequestSchema, request);
    const response = await client.get(`v2/payouts/`, {
        searchParams: { reference_id: validated_request.reference_id },
    });

    await handle_error(response, "Failed to list payouts");

    return v.parse(ListPayoutsResponseSchema, await response.json());
}

async function cancel_payout(request: CancelPayoutRequest): Promise<CancelPayoutResponse> {
    const validated_request = v.parse(CancelPayoutRequestSchema, request);
    const response = await client.post(`v2/payouts/${validated_request.payout_id}/cancel`);

    await handle_error(response, "Failed to cancel payout");

    return v.parse(CancelPayoutResponseSchema, await response.json());
}

async function get_payment_channels(request: GetPaymentChannelsRequest): Promise<GetPaymentChannelsResponse> {
    const validated_request = v.parse(GetPaymentChannelsRequestSchema, request);
    const params: Record<string, string> = {};
    if (validated_request.channel_name) params.channel_name = validated_request.channel_name;
    if (validated_request.channel_category) params.channel_category = validated_request.channel_category;
    if (validated_request.channel_code) params.channel_code = validated_request.channel_code;

    const response = await client.get("v2/payouts/channels", { searchParams: params });

    await handle_error(response, "Failed to retrieve payout channels");

    return v.parse(GetPaymentChannelsResponseSchema, await response.json());
}

export { create_payout, get_payout, get_payout_by_reference_id, cancel_payout, get_payment_channels };

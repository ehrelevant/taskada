import * as v from "valibot";

import { PayoutSchema } from "./payout";

export const CreatePayoutResponseSchema = PayoutSchema;

export const GetPaymentChannelsResponseSchema = v.array(
    v.object({
        channel_name: v.pipe(v.string(), v.description("Name of payout channel")),
        channel_category: v.pipe(v.string(), v.picklist(["BANK", "EWALLET", "OTC"])),
        channel_code: v.pipe(
            v.string(),
            v.description(
                "Channel code of destination bank, E-Wallet or OTC channel. List of supported channels can be found in https://docs.xendit.co/docs/payouts-coverage-philippines",
            ),
        ),
        currency: v.pipe(v.string(), v.regex(/^[a-zA-Z]{3}$/), v.description("ISO 4217 Currency Code")),
        amount_limits: v.pipe(
            v.object({
                minimum: v.pipe(v.number(), v.description("Minimum amount that can be paid out to this channel")),
                maximum: v.pipe(v.number(), v.description("Maximum amount that can be paid out to this channel")),
                minimum_increment: v.pipe(
                    v.number(),
                    v.description("Smallest amount increment allowed by the channel"),
                ),
            }),
        ),
    }),
);

export const CancelPayoutResponseSchema = PayoutSchema;

export const GetPayoutResponseSchema = PayoutSchema;
export const ListPayoutsResponseSchema = v.array(PayoutSchema);

import * as v from "valibot";

import { MetadataSchema } from "@standard/schema";

export const CustomerDetailsSchema = v.object({
    type: v.pipe(v.picklist(["INDIVIDUAL"]), v.description("Type of customer.")),
    reference_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description(
            "Merchant provided identifier for the customer. Must be unique. Alphanumeric no special characters allowed.",
        ),
    ),
    email: v.optional(
        v.pipe(
            v.string(),
            v.minLength(4),
            v.maxLength(50),
            v.description("E-mail address of customer. Maximum length 50 characters."),
        ),
    ),
    mobile_number: v.optional(MetadataSchema),
    individual_detail: v.pipe(v.object({}), v.description("Individual detail object for the customer.")),
});

import * as v from "valibot";

import { CustomerSchema } from "./customer";

export const GetCustomerListResponseSchema = v.object({
    data: v.array(CustomerSchema),
    has_more: v.boolean(),
});

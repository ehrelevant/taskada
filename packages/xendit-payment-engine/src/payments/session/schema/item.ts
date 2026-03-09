import * as v from "valibot";

import { MetadataSchema } from "@standard/schema";

export const ItemSchema = v.object({
    reference_id: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description("Merchant provided identifier for the item."),
    ),
    type: v.pipe(
        v.picklist(["DIGITAL_PRODUCT", "PHYSICAL_PRODUCT", "DIGITAL_SERVICE", "PHYSICAL_SERVICE", "FEE"]),
        v.description("Type of item."),
    ),
    name: v.pipe(v.string(), v.minLength(1), v.maxLength(255), v.description("Name of item.")),
    net_unit_amount: v.pipe(v.number(), v.description("Net amount to be charged per unit.")),
    quantity: v.pipe(v.number(), v.minValue(1), v.description("Number of units of this item in the basket.")),
    url: v.pipe(v.string(), v.description("URL of the item. Must be HTTPS or HTTP.")),
    image_url: v.pipe(v.string(), v.description("URL of the image of the item. Must be HTTPS or HTTP.")),
    category: v.pipe(v.string(), v.maxLength(255), v.description("Category for item.")),
    subcategory: v.pipe(v.string(), v.maxLength(255), v.description("Sub-category for item.")),
    description: v.pipe(v.string(), v.maxLength(255), v.description("Description of item.")),
    metadata: MetadataSchema,
});

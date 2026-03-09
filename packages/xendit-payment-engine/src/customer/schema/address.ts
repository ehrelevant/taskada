import * as v from "valibot";

export const StandardAddressSchema = v.object({
    country: v.pipe(v.string(), v.regex(/^[A-Z]{2}$/), v.description("ISO 3166-1 alpha-2 Country Code")),
    street_line1: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255),
        v.description("Line 1 of street address e.g., building name and apartment number"),
    ),
    street_line2: v.nullable(
        v.pipe(
            v.string(),
            v.minLength(1),
            v.maxLength(255),
            v.description("Line 2 of street address e.g., building name and apartment number"),
        ),
    ),
    city: v.nullable(
        v.pipe(
            v.string(),
            v.minLength(1),
            v.maxLength(255),
            v.description("City, village or town of residence of customer"),
        ),
    ),
    province_state: v.nullable(
        v.pipe(
            v.string(),
            v.minLength(1),
            v.maxLength(255),
            v.description("Province, state or region of residence of customer"),
        ),
    ),
    postal_code: v.nullable(
        v.pipe(v.string(), v.minLength(1), v.maxLength(255), v.description("ZIP/Postal Code of customer")),
    ),
    category: v.nullable(v.pipe(v.picklist(["HOME", "WORK", "PROVINCIAL"]), v.description("Address type"))),
    is_primary: v.pipe(
        v.boolean(),
        v.description("Indicates that the information provided refers to the customer's primary address"),
    ),
});

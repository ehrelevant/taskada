import * as v from "valibot";

export const BusinessDetailSchema = v.object({
    business_name: v.pipe(v.string(), v.minLength(1), v.maxLength(50), v.description("Name of business")),
    trading_name: v.nullable(v.pipe(v.string(), v.minLength(1), v.maxLength(50), v.description("Trading name"))),
    business_type: v.nullable(
        v.pipe(
            v.picklist([
                "SOLE_PROPRIETOR",
                "PARTNERSHIP",
                "COOPERATIVE",
                "TRUST",
                "NON_PROFIT",
                "GOVERNMENT",
                "CORPORATION",
            ]),
            v.description("Legal entity type of the business"),
        ),
    ),
    nature_of_business: v.nullable(
        v.pipe(
            v.string(),
            v.minLength(1),
            v.maxLength(50),
            v.description(
                "Free text description of the type of business this entity pursues. Example: Ecommerce, Travel",
            ),
        ),
    ),
    business_domicile: v.nullable(
        v.pipe(v.string(), v.regex(/^[A-Z]{2}$/), v.description("Registered country of the business. ISO 3166 format")),
    ),
    date_of_registration: v.nullable(v.pipe(v.string(), v.description("Business registration date"))),
});

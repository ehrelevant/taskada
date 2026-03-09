import * as v from "valibot";

export const KycDocumentsObjectSchema = v.object({
    country: v.pipe(v.string(), v.minLength(2), v.maxLength(2), v.description("ISO 3166-1 alpha-2 Country Code")),
    type: v.pipe(
        v.picklist([
            "BIRTH_CERTIFICATE",
            "BANK_STATEMENT",
            "DRIVING_LICENSE",
            "IDENTITY_CARD",
            "PASSPORT",
            "VISA",
            "BUSINESS_REGISTRATION",
            "BUSINESS_LICENSE",
        ]),
        v.description("Generic ID type"),
    ),
    sub_type: v.pipe(
        v.picklist([
            "NATIONAL_ID",
            "CONSULAR_ID",
            "VOTER_ID",
            "POSTAL_ID",
            "RESIDENCE_PERMIT",
            "TAX_ID",
            "STUDENT_ID",
            "MILITARY_ID",
            "MEDICAL_ID",
            "OTHERS",
        ]),
        v.description("Specific ID type for IDENTITY_CARD types"),
    ),
    document_name: v.pipe(
        v.string(),
        v.regex(/^[a-zA-Z0-9 ]{0,255}$/),
        v.description(
            "Free text description of the type of document (e.g., NIB, SIUP, AKTA). Alphanumeric. No special characters is allowed.",
        ),
    ),
    document_number: v.pipe(
        v.string(),
        v.regex(/^[a-zA-Z0-9]{0,255}$/),
        v.description(
            "Unique alphanumeric identity document number or code. Alphanumeric. No special characters is allowed.",
        ),
    ),
    expires_at: v.nullable(v.pipe(v.string(), v.description("Expiry date, if relevant"))),
    holder_name: v.pipe(
        v.string(),
        v.regex(/^[a-zA-Z0-9 ]{0,255}$/),
        v.description(
            "Full name(s) of the individual or business as defined on the document, if relevant. Alphanumeric. No special characters is allowed.",
        ),
    ),
    document_images: v.pipe(
        v.array(v.string()),
        v.description("Array of file ids representing images of the document, in png/jpg/jpeg/pdf format"),
    ),
});

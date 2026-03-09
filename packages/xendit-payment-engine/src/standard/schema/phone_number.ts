import * as v from "valibot";

export const PhoneNumberSchema = v.nullable(
    v.pipe(
        v.string(),
        v.regex(/^((\+\d{1,15})|(0\d{7,15})|(\d{7,15}))$/),
        v.description("Supports both E.164 international format (+) and local formats with or without a leading zero."),
    ),
);

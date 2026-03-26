# Project

- This project uses Typescript
- Do not use type any

## Structure

├── AGENTS.md
├── jest.config.ts
├── package.json
├── src
│ ├── client.test.ts
│ ├── client.ts
│ ├── customer
│ │ ├── index.test.ts
│ │ ├── index.ts
│ │ ├── schema
│ │ │ ├── address.ts
│ │ │ ├── business_detail.ts
│ │ │ ├── customer.ts
│ │ │ ├── employment.ts
│ │ │ ├── identity_account.ts
│ │ │ ├── index.ts
│ │ │ ├── individual_detail.ts
│ │ │ ├── kyc_document.ts
│ │ │ ├── request.ts
│ │ │ └── response.ts
│ │ └── types.ts
│ ├── index.ts
│ ├── payments
│ │ ├── index.ts
│ │ ├── payment
│ │ │ ├── index.test.ts
│ │ │ ├── index.ts
│ │ │ ├── schema
│ │ │ │ ├── captures.ts
│ │ │ │ ├── index.ts
│ │ │ │ ├── payment.ts
│ │ │ │ ├── request.ts
│ │ │ │ └── response.ts
│ │ │ └── types.ts
│ │ ├── payment_request
│ │ │ ├── index.ts
│ │ │ ├── schema
│ │ │ │ ├── index.ts
│ │ │ │ ├── object.ts
│ │ │ │ ├── pay.ts
│ │ │ │ ├── request.ts
│ │ │ │ ├── response.ts
│ │ │ │ └── webhook.ts
│ │ │ └── types.ts
│ │ ├── refund
│ │ │ ├── index.test.ts
│ │ │ ├── index.ts
│ │ │ ├── schema
│ │ │ │ ├── index.ts
│ │ │ │ ├── request.ts
│ │ │ │ └── response.ts
│ │ │ └── types.ts
│ │ ├── schema.ts
│ │ ├── session
│ │ │ ├── index.test.ts
│ │ │ ├── index.ts
│ │ │ ├── schema
│ │ │ │ ├── channel_properties.ts
│ │ │ │ ├── customer.ts
│ │ │ │ ├── index.ts
│ │ │ │ ├── individual_detail.ts
│ │ │ │ ├── item.ts
│ │ │ │ ├── request.ts
│ │ │ │ └── response.ts
│ │ │ └── types.ts
│ │ └── types.ts
│ ├── payouts
│ │ ├── index.test.ts
│ │ ├── index.ts
│ │ ├── schema
│ │ │ ├── index.ts
│ │ │ ├── payout.ts
│ │ │ ├── request.ts
│ │ │ └── response.ts
│ │ └── types.ts
│ ├── schema.ts
│ ├── standard
│ │ ├── index.ts
│ │ ├── schema
│ │ │ ├── error_response.ts
│ │ │ ├── index.test.ts
│ │ │ ├── index.ts
│ │ │ ├── json.ts
│ │ │ ├── metadata.ts
│ │ │ └── phone_number.ts
│ │ └── types.ts
│ ├── tests.ts
│ └── types.ts
├── tsconfig.json
└── tsup.config.ts

# Validation

- Use **Zod** for runtime validation
- Import Zod using `import * as z from "zod";`
- Schema names MUST be in PascalCase and end in the word `Schema`

```typescript
// Good
export const AcquireRequestSchema = ...
export const AcquireResponseSchema = ...
export const UserSchema = ...

// Bad
export const acquireRequestSchema = ...
export const Acquire_Response_Schema = ...
export const user_schema = ...
export const boss = ...
```

- Schema Fields MUST use snake_case
- Ensure that validation errors are always readable and traceable by including clear and concise error messages.
- ALWAYS include a `z.meta()` field which contains the object `{ description: ..., example: ... }`.
- Do not use `z.describe()` as it is deprecated
- Use `z.iso.datetime()`, `z.iso.date()`, `z.iso.time()` instead of `z.string()` when the the input is a datetime, date, time
- If the characters for the input are restricted, use `z.regex()` and move `z.min()` and/or `z.max()`.

```typescript
import * as z from 'zod';
// Good
const SomeRandomSchema = z
  .object({
    name: z.string('Invalid name passed.'),
    url: z.url('The URL is badly formatted.').meta({
      description: 'Description for URL',
      example: ['http://test.com', 'https://google.com'],
    }),
  })
  .meta({
    description: 'A schema used for ...',
    example: [
      {
        name: 'Alice',
        url: 'http://alice.me',
      },
      {
        name: 'Bob',
        url: 'http://bob.org',
      },
    ],
  });

// Bad
const SomeOtherSchema = z.object({
  email: z.email().nonoptional,
  first_name: z.string(),
  age: z.int(),
});
```

- Ensure that each Zod object has a corresponding `type` in the form `export type Example = z.Infer<ExampleSchema>`
- If a Schema is in the form of `...RequestSchema`, the type should be created using `z.input`
- If a Schema is in the form of `...ResponseSchema` or just `...Schema`, the type should be created using `z.infer` or `z.output`

```typescript
// Good
export type AcquireRequest = z.input<typeof AcquireRequestSchema>
export type AcquireResponse = z.output<typeof AcquireRequestSchema>
export type GetObjectResponse = z.infer<typeof AcquireRequestSchema>
export type User = z.infer<typeof AcquireRequestSchema>

// Bad
export const acquireRequest = z.output<typeof ...>
export const GetemployeeRequest = z.infer<typeof ...>
export const Acquire_Response = z.input<typeof ...>
export const user = z.input<typeof ...>
export const boss = z.input<typeof ...>
```

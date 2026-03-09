import * as v from 'valibot';

import { EmploymentSchema } from './employment';

export const IndividualDetailSchema = v.object({
  given_names: v.pipe(
    v.string(),
    v.regex(/^[a-zA-Z0-9]{1,50}$/),
    v.description('Primary or first name/s of customer. Alphanumeric. No special characters is allowed.'),
  ),
  surname: v.nullable(
    v.pipe(
      v.string(),
      v.regex(/^[a-zA-Z0-9]{1,50}$/),
      v.description('Last or family name of customer. Alphanumeric. No special characters is allowed.'),
    ),
  ),
  nationality: v.nullable(
    v.pipe(
      v.string(),
      v.regex(/^[A-Z]{2}$/),
      v.description('Country code for customer nationality. ISO 3166-1 alpha-2 Country Code'),
    ),
  ),
  place_of_birth: v.nullable(
    v.pipe(
      v.string(),
      v.regex(/^[a-zA-Z0-9]{1,60}$/),
      v.description(
        'City or other relevant location for the customer birth place. Alphanumeric. No special characters is allowed.',
      ),
    ),
  ),
  date_of_birth: v.nullable(v.string()),
  gender: v.nullable(v.pipe(v.picklist(['MALE', 'FEMALE', 'OTHER']), v.description('Gender of customer'))),
  employment: EmploymentSchema,
});

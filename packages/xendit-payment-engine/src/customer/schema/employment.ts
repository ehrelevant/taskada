import * as v from 'valibot';

export const EmploymentSchema = v.nullable(
  v.object({
    employer_name: v.pipe(v.string(), v.minLength(1), v.maxLength(50), v.description('Name of the employer')),
    nature_of_business: v.pipe(
      v.string(),
      v.minLength(1),
      v.maxLength(50),
      v.description('Industry or nature of business'),
    ),
    role_description: v.pipe(v.string(), v.minLength(1), v.maxLength(50), v.description('Occupation or title')),
  }),
);

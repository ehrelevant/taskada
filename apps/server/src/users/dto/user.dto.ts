import { InferOutput, minLength, object, optional, pipe, string } from 'valibot';

export const UpdateUserProfileSchema = object({
  firstName: pipe(string(), minLength(1, 'First name is required')),
  middleName: optional(string()),
  lastName: pipe(string(), minLength(1, 'Last name is required')),
  phoneNumber: pipe(string(), minLength(1, 'Phone number is required')),
  avatarUrl: optional(string()),
});

export type UpdateUserProfileDto = InferOutput<typeof UpdateUserProfileSchema>;

export const ChangePasswordSchema = object({
  oldPassword: pipe(string(), minLength(1, 'Current password is required')),
  newPassword: pipe(string(), minLength(8, 'New password must be at least 8 characters')),
});

export type ChangePasswordDto = InferOutput<typeof ChangePasswordSchema>;

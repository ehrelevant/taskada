import * as v from 'valibot';
import { minLength, pipe, string } from 'valibot';

export const UpdateUserProfileSchema = v.object({
  firstName: pipe(string(), minLength(1, 'First name is required')),
  middleName: v.optional(string()),
  lastName: pipe(string(), minLength(1, 'Last name is required')),
  phoneNumber: pipe(string(), minLength(1, 'Phone number is required')),
  avatarUrl: v.optional(string()),
});

export const ChangePasswordSchema = v.object({
  oldPassword: pipe(string(), minLength(1, 'Current password is required')),
  newPassword: pipe(string(), minLength(8, 'New password must be at least 8 characters')),
});

export type UserRole = 'provider' | 'seeker' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl: string | null;
  role: UserRole | null;
}

export interface UpdateProfilePayload {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
}

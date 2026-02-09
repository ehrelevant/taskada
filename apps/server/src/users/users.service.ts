import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { user } from '@repo/database';

import { DatabaseService } from '../database/database.service';

export interface UpdateUserProfileData {
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async getUserProfile(userId: string) {
    const [foundUser] = await this.dbService.db
      .select({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(eq(user.id, userId));

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return foundUser;
  }

  async updateUserProfile(userId: string, updateData: UpdateUserProfileData) {
    try {
      // For now, let's update directly in database since Better Auth's updateUser API is limited
      const [updatedUser] = await this.dbService.db
        .update(user)
        .set({
          firstName: updateData.firstName,
          middleName: updateData.middleName,
          lastName: updateData.lastName,
          phoneNumber: updateData.phoneNumber,
          avatarUrl: updateData.avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId))
        .returning({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          avatarUrl: user.avatarUrl,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return updatedUser;
    } catch (error) {
      throw new BadRequestException(`Failed to update profile: ${(error as Error).message}`);
    }
  }

  async changePassword(userId: string, _oldPassword: string, _newPassword: string) {
    // Get current user to verify they exist
    const existingUser = await this.getUserProfile(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // For now, disable password change until we can properly integrate with Better Auth
    throw new BadRequestException('Password change functionality is not yet implemented. Please contact support.');
  }
}

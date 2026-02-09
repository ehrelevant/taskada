import { and, eq } from 'drizzle-orm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { seeker, user, userRole } from '@repo/database';

import { DatabaseService } from '../database/database.service';

import { UpdateSeekerSwaggerDto } from './dto/update-seeker.dto';

@Injectable()
export class SeekersService {
  constructor(private readonly dbService: DatabaseService) {}

  async createSeeker(userId: string) {
    // Check if user exists
    const [existingUser] = await this.dbService.db.select().from(user).where(eq(user.id, userId));

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has seeker role
    const [existingRole] = await this.dbService.db
      .select()
      .from(userRole)
      .where(and(eq(userRole.userId, userId), eq(userRole.role, 'seeker')));
    if (existingRole) {
      throw new ConflictException('User is already a seeker');
    }

    try {
      // Create seeker record
      const [newSeeker] = await this.dbService.db
        .insert(seeker)
        .values({
          userId,
        })
        .returning();

      // Assign seeker role
      await this.dbService.db.insert(userRole).values({
        userId,
        role: 'seeker',
      });

      return newSeeker;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Seeker already exists for this user');
      }
      throw error;
    }
  }

  async getSeekerByUserId(userId: string) {
    const [foundSeeker] = await this.dbService.db
      .select({
        userId: seeker.userId,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(seeker)
      .leftJoin(user, eq(seeker.userId, user.id))
      .where(eq(seeker.userId, userId));

    if (!foundSeeker) {
      throw new NotFoundException(`Seeker with user ID ${userId} not found`);
    }

    return foundSeeker;
  }

  async updateSeeker(userId: string, updateSeekerDto: UpdateSeekerSwaggerDto) {
    const [updatedSeeker] = await this.dbService.db
      .update(seeker)
      .set(updateSeekerDto)
      .where(eq(seeker.userId, userId))
      .returning();

    if (!updatedSeeker) {
      throw new NotFoundException(`Seeker with user ID ${userId} not found`);
    }

    return updatedSeeker;
  }
}

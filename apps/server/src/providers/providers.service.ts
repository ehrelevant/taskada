import { agency, provider, user, userRole } from '@repo/database';
import { and, eq } from 'drizzle-orm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { CreateProviderSwaggerDto } from './dto/create-provider.dto';
import { UpdateProviderSwaggerDto } from './dto/update-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private readonly dbService: DatabaseService) {}

  async createProvider(userId: string, { agencyId, isAccepting }: CreateProviderSwaggerDto) {
    // Check if user exists
    const [existingUser] = await this.dbService.db.select().from(user).where(eq(user.id, userId));

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has provider role
    const [existingRole] = await this.dbService.db
      .select()
      .from(userRole)
      .where(and(eq(userRole.userId, userId), eq(userRole.role, 'provider')));

    if (existingRole) {
      throw new ConflictException('User is already a provider');
    }

    try {
      // Create provider record
      const [newProvider] = await this.dbService.db
        .insert(provider)
        .values({
          userId,
          agencyId,
          isAccepting: isAccepting ?? false,
        })
        .returning();

      // Assign provider role
      await this.dbService.db.insert(userRole).values({
        userId,
        role: 'provider',
      });

      return newProvider;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Provider already exists for this user');
      }
      throw error;
    }
  }

  async getProviderByUserId(userId: string) {
    const [foundProvider] = await this.dbService.db
      .select({
        userId: provider.userId,
        agencyId: provider.agencyId,
        isAccepting: provider.isAccepting,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          avatarUrl: user.avatarUrl,
        },
        agency: {
          id: agency.id,
          name: agency.name,
          description: agency.description,
          avatarUrl: agency.avatarUrl,
        },
      })
      .from(provider)
      .leftJoin(user, eq(provider.userId, user.id))
      .leftJoin(agency, eq(provider.agencyId, agency.id))
      .where(eq(provider.userId, userId));

    if (!foundProvider) {
      throw new NotFoundException(`Provider with user ID ${userId} not found`);
    }

    return foundProvider;
  }

  async updateProvider(userId: string, updateProviderDto: UpdateProviderSwaggerDto) {
    const [updatedProvider] = await this.dbService.db
      .update(provider)
      .set(updateProviderDto)
      .where(eq(provider.userId, userId))
      .returning();

    if (!updatedProvider) {
      throw new NotFoundException(`Provider with user ID ${userId} not found`);
    }

    return updatedProvider;
  }
}

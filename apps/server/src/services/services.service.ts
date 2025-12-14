import { and, eq } from 'drizzle-orm';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { provider, service, serviceType } from '@repo/database';

import { DatabaseService } from '../database/database.service';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly dbService: DatabaseService) {}

  async createService(userId: string, createServiceDto: CreateServiceDto) {
    // TODO: Disallow passing of userId through DTO
    const providers = await this.dbService.db
      .select()
      .from(provider)
      .where(eq(provider.userId, userId));

    if (providers.length === 0) {
      throw new ForbiddenException('User is not a provider');
    }

    const [newService] = await this.dbService.db.insert(service).values(createServiceDto).returning();

    return newService;
  }

  async getAllServices(serviceTypeId?: string, providerUserId?: string) {
    return await this.dbService.db
      .select({
        id: service.id,
        initialCost: service.initialCost,
        isEnabled: service.isEnabled,
        serviceTypeName: serviceType.name,
        serviceTypeDescription: serviceType.description,
        serviceTypeIconUrl: serviceType.iconUrl,
        providerUserId: provider.userId,
        providerIsAccepting: provider.isAccepting,
      })
      .from(service)
      .leftJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .leftJoin(provider, eq(service.providerUserId, provider.userId))
      .where(
        and(
          serviceTypeId ? eq(service.serviceTypeId, serviceTypeId) : undefined,
          providerUserId ? eq(service.providerUserId, providerUserId) : undefined,
        ),
      );
  }

  async updateService(id: string, updateServiceDto: UpdateServiceDto) {
    const [updatedService] = await this.dbService.db
      .update(service)
      .set(updateServiceDto)
      .where(eq(service.id, id))
      .returning();

    if (!updatedService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return updatedService;
  }

  async deleteService(id: string) {
    const [deletedService] = await this.dbService.db.delete(service).where(eq(service.id, id)).returning();

    if (!deletedService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return { message: 'Service deleted successfully' };
  }
}

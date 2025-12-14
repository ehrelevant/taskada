import { desc, eq } from 'drizzle-orm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { service, serviceType } from '@repo/database';

import { DatabaseService } from '../database/database.service';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly dbService: DatabaseService) {}

  async createService(createServiceDto: CreateServiceDto) {
    const [newService] = await this.dbService.db
      .insert(service)
      .values(createServiceDto)
      .returning();
    return newService;
  }

  async getServicesByProviderId(providerUserId: string) {
    const services = await this.dbService.db
      .select({
        id: service.id,
        initialCost: service.initialCost,
        isEnabled: service.isEnabled,
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
          description: serviceType.description,
          iconUrl: serviceType.iconUrl,
        },
      })
      .from(service)
      .leftJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .where(eq(service.providerUserId, providerUserId))
      .orderBy(desc(service.isEnabled)); // Active services first

    return services;
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
    const [deletedService] = await this.dbService.db
      .delete(service)
      .where(eq(service.id, id))
      .returning();

    if (!deletedService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return { message: 'Service deleted successfully' };
  }
}
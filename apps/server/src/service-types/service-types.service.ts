import { eq } from 'drizzle-orm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { serviceType } from '@repo/database';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class ServiceTypesService {
  constructor(private readonly dbService: DatabaseService) {}

  async getServiceTypeById(id: string) {
    const [foundServiceType] = await this.dbService.db.select().from(serviceType).where(eq(serviceType.id, id));

    if (!foundServiceType) {
      throw new NotFoundException(`Service type with ID ${id} not found`);
    }

    return foundServiceType;
  }

  async getAllServiceTypes() {
    return await this.dbService.db.select().from(serviceType);
  }
}

import { Injectable } from '@nestjs/common';
import { serviceType } from '@repo/database';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class ServiceTypesService {
  constructor(private readonly dbService: DatabaseService) {}

  async getAllServiceTypes() {
    return await this.dbService.db
      .select()
      .from(serviceType)
      .orderBy(serviceType.name);
  }
}
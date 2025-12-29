import { address, request, seeker, serviceType, user } from '@repo/database';
import { desc, eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class RequestsService {
  constructor(private readonly dbService: DatabaseService) {}

  async getNearbyRequests() {
    // TODO: Filter by PostGIS distance
    return await this.dbService.db
      .select({
        id: request.id,
        description: request.description,
        serviceTypeName: serviceType.name,
        seekerFirstName: user.firstName,
        addressLabel: address.label,
        addressCoordinates: address.coordinates,
        createdAt: request.createdAt,
      })
      .from(request)
      .innerJoin(serviceType, eq(request.serviceTypeId, serviceType.id))
      .innerJoin(seeker, eq(request.seekerUserId, seeker.userId))
      .innerJoin(user, eq(seeker.userId, user.id))
      .innerJoin(address, eq(request.addressId, address.id))
      .orderBy(desc(request.createdAt));
  }

  async getRequestById(id: string) {
    const result = await this.dbService.db
      .select({
        id: request.id,
        description: request.description,
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
          icon: serviceType.iconUrl,
        },
        seeker: {
          id: seeker.userId,
          name: user.firstName,
          lastName: user.lastName,
          avatar: user.avatarUrl,
          phone: user.phoneNumber,
        },
        address: {
          label: address.label,
          coordinates: address.coordinates,
        },
      })
      .from(request)
      .innerJoin(serviceType, eq(request.serviceTypeId, serviceType.id))
      .innerJoin(seeker, eq(request.seekerUserId, seeker.userId))
      .innerJoin(user, eq(seeker.userId, user.id))
      .innerJoin(address, eq(request.addressId, address.id))
      .where(eq(request.id, id))
      .limit(1);

    return result[0];
  }
}

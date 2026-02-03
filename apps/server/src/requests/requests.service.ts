import { address, request, requestImage, seeker, serviceType, user } from '@repo/database';
import { BadRequestException, Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service';

import { CreateRequestDto } from './dto/create-request.dto';

type GeographyPoint = [number, number];

@Injectable()
export class RequestsService {
  constructor(private readonly dbService: DatabaseService) {}

  async createAddress(label: string, lat: number, lng: number) {
    const [newAddress] = await this.dbService.db
      .insert(address)
      .values({
        label,
        coordinates: [lng, lat] as GeographyPoint,
      })
      .returning();

    return newAddress;
  }

  async createRequest(dto: CreateRequestDto, seekerUserId: string) {
    const [seekerRecord] = await this.dbService.db
      .select()
      .from(seeker)
      .where(eq(seeker.userId, seekerUserId))
      .limit(1);

    if (!seekerRecord) {
      throw new BadRequestException('User is not a seeker');
    }

    const [newAddress] = await this.dbService.db
      .insert(address)
      .values({
        label: dto.addressLabel,
        coordinates: [dto.longitude, dto.latitude] as GeographyPoint,
      })
      .returning();

    const [newRequest] = await this.dbService.db
      .insert(request)
      .values({
        serviceTypeId: dto.serviceTypeId,
        serviceId: dto.serviceId,
        seekerUserId,
        addressId: newAddress.id,
        description: dto.description,
      })
      .returning();

    if (dto.imageUrls && dto.imageUrls.length > 0) {
      await this.addRequestImages(newRequest.id, dto.imageUrls);
    }

    return newRequest;
  }

  async addRequestImages(requestId: string, imageUrls: string[]) {
    const images = imageUrls.map(url => ({
      requestId,
      image: url,
    }));

    await this.dbService.db.insert(requestImage).values(images);
  }

  async getNearbyRequests() {
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

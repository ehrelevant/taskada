import { address, request, requestImage, seeker, serviceType, user } from '@repo/database';
import { and, desc, eq, inArray, or } from 'drizzle-orm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { MatchingGateway } from '../matching/matching.gateway';

import { CreateRequestDto } from './dto/create-request.dto';

type GeographyPoint = [number, number];

@Injectable()
export class RequestsService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly matchingGateway: MatchingGateway,
  ) {}

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
        status: 'pending',
      })
      .returning();

    if (dto.imageUrls && dto.imageUrls.length > 0) {
      await this.addRequestImages(newRequest.id, dto.imageUrls);
    }

    // Broadcast the new request to relevant providers via WebSocket
    this.matchingGateway.broadcastNewRequest(newRequest.id, dto.serviceTypeId, dto.serviceId);

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
        serviceId: request.serviceId,
        seekerUserId: request.seekerUserId,
        description: request.description,
        status: request.status,
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

  async getPendingRequests(serviceTypeIds: string[], serviceIds: string[]) {
    const requests = await this.dbService.db
      .select({
        id: request.id,
        serviceTypeId: request.serviceTypeId,
        serviceId: request.serviceId,
        seekerUserId: request.seekerUserId,
        addressId: request.addressId,
        description: request.description,
        status: request.status,
        createdAt: request.createdAt,
      })
      .from(request)
      .where(
        and(
          eq(request.status, 'pending'),
          or(
            serviceIds ? inArray(request.serviceId, serviceIds) : undefined,
            serviceTypeIds ? inArray(request.serviceTypeId, serviceTypeIds) : undefined,
          ),
        ),
      )
      .orderBy(desc(request.createdAt));

    // Get full details for each request
    // TODO: Change this to a single query with joins for better performance
    const detailedRequests = await Promise.all(
      requests.map(async req => {
        // Get service type
        const [serviceTypeRecord] = await this.dbService.db
          .select({
            id: serviceType.id,
            name: serviceType.name,
            iconUrl: serviceType.iconUrl,
          })
          .from(serviceType)
          .where(eq(serviceType.id, req.serviceTypeId))
          .limit(1);

        // Get seeker info
        const [seekerRecord] = await this.dbService.db
          .select({
            userId: seeker.userId,
          })
          .from(seeker)
          .where(eq(seeker.userId, req.seekerUserId))
          .limit(1);

        const [userRecord] = await this.dbService.db
          .select({
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            phoneNumber: user.phoneNumber,
          })
          .from(user)
          .where(eq(user.id, req.seekerUserId))
          .limit(1);

        // Get address
        const [addressRecord] = await this.dbService.db
          .select({
            id: address.id,
            label: address.label,
            coordinates: address.coordinates,
          })
          .from(address)
          .where(eq(address.id, req.addressId))
          .limit(1);

        // Get images
        const imageRecords = await this.dbService.db
          .select({ image: requestImage.image })
          .from(requestImage)
          .where(eq(requestImage.requestId, req.id));

        return {
          id: req.id,
          serviceTypeId: req.serviceTypeId,
          serviceId: req.serviceId,
          seekerUserId: req.seekerUserId,
          addressId: req.addressId,
          description: req.description,
          status: req.status,
          createdAt: req.createdAt,
          serviceType: serviceTypeRecord || { id: '', name: 'Unknown', iconUrl: null },
          seeker: {
            id: seekerRecord?.userId || '',
            firstName: userRecord?.firstName || '',
            lastName: userRecord?.lastName || '',
            avatarUrl: userRecord?.avatarUrl || null,
            phoneNumber: userRecord?.phoneNumber || '',
          },
          address: {
            id: addressRecord?.id || '',
            label: addressRecord?.label || null,
            coordinates: addressRecord?.coordinates || [0, 0],
          },
          images: imageRecords.map(img => img.image),
        };
      }),
    );

    return detailedRequests;
  }

  async updateRequestStatus(requestId: string, status: 'pending' | 'settling'): Promise<void> {
    const [updatedRequest] = await this.dbService.db
      .update(request)
      .set({ status })
      .where(eq(request.id, requestId))
      .returning();

    if (!updatedRequest) {
      throw new NotFoundException('Request not found');
    }
  }
}

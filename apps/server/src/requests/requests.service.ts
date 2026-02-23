import { address, request, requestImage, seeker, serviceType, user } from '@repo/database';
import { and, desc, eq, inArray, or } from 'drizzle-orm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { MatchingGateway } from '../matching/matching.gateway';
import { S3Service } from '../s3/s3.service';

import { CreateRequestDto } from './dto/create-request.dto';

type GeographyPoint = [number, number];

function createGeographyPoint(lng: number, lat: number): GeographyPoint {
  return [lng, lat];
}

export interface PendingRequestDetails {
  id: string;
  serviceTypeId: string;
  serviceId: string | null;
  seekerUserId: string;
  addressId: string;
  description: string | null;
  status: string;
  createdAt: Date;
  serviceType: {
    id: string;
    name: string;
    iconUrl: string | null;
  };
  seeker: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    phoneNumber: string;
  };
  address: {
    id: string;
    label: string | null;
    coordinates: GeographyPoint;
  };
  images: string[];
}

@Injectable()
export class RequestsService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly matchingGateway: MatchingGateway,
    private readonly s3Service: S3Service,
  ) {}

  async createAddress(label: string, lat: number, lng: number) {
    const [newAddress] = await this.dbService.db
      .insert(address)
      .values({
        label,
        coordinates: createGeographyPoint(lng, lat),
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
        coordinates: createGeographyPoint(dto.longitude, dto.latitude),
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

  async uploadRequestImages(requestId: string, files: Express.Multer.File[]) {
    const imageKeys: string[] = [];

    for (const file of files) {
      const result = await this.s3Service.uploadFile(file, 'requests', requestId);
      imageKeys.push(result.key);
    }

    await this.addRequestImages(requestId, imageKeys);
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
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          phoneNumber: user.phoneNumber,
        },
        address: {
          label: address.label,
          coordinates: address.coordinates,
        },
        requestImage: requestImage.image,
      })
      .from(request)
      .innerJoin(serviceType, eq(request.serviceTypeId, serviceType.id))
      .innerJoin(seeker, eq(request.seekerUserId, seeker.userId))
      .innerJoin(user, eq(seeker.userId, user.id))
      .innerJoin(address, eq(request.addressId, address.id))
      .leftJoin(requestImage, eq(request.id, requestImage.requestId))
      .where(eq(request.id, id));

    if (!result[0]) {
      return null;
    }

    const baseData = result[0];

    const imageUrls: string[] = [];
    for (const row of result) {
      if (row.requestImage) {
        const signedUrl = await this.s3Service.getSignedUrl(row.requestImage);
        imageUrls.push(signedUrl);
      }
    }

    return {
      id: baseData.id,
      serviceId: baseData.serviceId,
      seekerUserId: baseData.seekerUserId,
      description: baseData.description,
      status: baseData.status,
      serviceType: baseData.serviceType,
      seeker: baseData.seeker,
      address: baseData.address,
      images: imageUrls,
    };
  }

  async getPendingRequests(serviceTypeIds: string[], serviceIds: string[]) {
    const rows = await this.dbService.db
      .select({
        id: request.id,
        serviceTypeId: request.serviceTypeId,
        serviceId: request.serviceId,
        seekerUserId: request.seekerUserId,
        addressId: request.addressId,
        description: request.description,
        status: request.status,
        createdAt: request.createdAt,
        serviceTypeId_st: serviceType.id,
        serviceTypeName: serviceType.name,
        serviceTypeIconUrl: serviceType.iconUrl,
        seekerUserId_sk: seeker.userId,
        userFirstName: user.firstName,
        userLastName: user.lastName,
        userAvatarUrl: user.avatarUrl,
        userPhoneNumber: user.phoneNumber,
        addressId_ad: address.id,
        addressLabel: address.label,
        addressCoordinates: address.coordinates,
        requestImage: requestImage.image,
      })
      .from(request)
      .leftJoin(serviceType, eq(request.serviceTypeId, serviceType.id))
      .leftJoin(seeker, eq(request.seekerUserId, seeker.userId))
      .leftJoin(user, eq(seeker.userId, user.id))
      .leftJoin(address, eq(request.addressId, address.id))
      .leftJoin(requestImage, eq(request.id, requestImage.requestId))
      .where(
        and(
          eq(request.status, 'pending'),
          or(
            serviceIds.length > 0 ? inArray(request.serviceId, serviceIds) : undefined,
            serviceTypeIds.length > 0 ? inArray(request.serviceTypeId, serviceTypeIds) : undefined,
          ),
        ),
      )
      .orderBy(desc(request.createdAt));

    // Group rows by request ID and aggregate images
    const requestMap = new Map<string, PendingRequestDetails>();

    for (const row of rows) {
      if (!requestMap.has(row.id)) {
        requestMap.set(row.id, {
          id: row.id,
          serviceTypeId: row.serviceTypeId,
          serviceId: row.serviceId,
          seekerUserId: row.seekerUserId,
          addressId: row.addressId,
          description: row.description,
          status: row.status,
          createdAt: row.createdAt,
          serviceType: {
            id: row.serviceTypeId_st || '',
            name: row.serviceTypeName || 'Unknown',
            iconUrl: row.serviceTypeIconUrl || null,
          },
          seeker: {
            id: row.seekerUserId_sk || '',
            firstName: row.userFirstName || '',
            lastName: row.userLastName || '',
            avatarUrl: row.userAvatarUrl || null,
            phoneNumber: row.userPhoneNumber || '',
          },
          address: {
            id: row.addressId_ad || '',
            label: row.addressLabel || null,
            coordinates: row.addressCoordinates || [0, 0],
          },
          images: [] as string[],
        });
      }

      if (row.requestImage) {
        const requestDetails = requestMap.get(row.id);
        if (requestDetails) {
          const signedUrl = await this.s3Service.getSignedUrl(row.requestImage);
          requestDetails.images.push(signedUrl);
        }
      }
    }

    return Array.from(requestMap.values());
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

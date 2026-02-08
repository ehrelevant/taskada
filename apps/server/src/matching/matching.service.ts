import { address, provider, request, requestImage, seeker, service, serviceType, user } from '@repo/database';
import { and, eq } from 'drizzle-orm';
import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

export interface RequestDetails {
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
    coordinates: [number, number];
  };
  images: string[];
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(private readonly dbService: DatabaseService) {}

  /**
   * Get providers who should receive a request broadcast
   * Returns list of provider user IDs who:
   * - Have isAccepting = true
   * - Have a service with isEnabled = true for the service type
   * - If serviceId is specified, match that specific provider
   */
  async getTargetProviders(serviceTypeId: string, serviceId?: string): Promise<string[]> {
    if (serviceId) {
      // Specific provider request - get the provider for this service
      const [serviceRecord] = await this.dbService.db
        .select({
          providerUserId: service.providerUserId,
          isEnabled: service.isEnabled,
        })
        .from(service)
        .where(eq(service.id, serviceId))
        .limit(1);

      if (!serviceRecord || !serviceRecord.isEnabled) {
        return [];
      }

      // Check if provider is accepting
      const [providerRecord] = await this.dbService.db
        .select({ isAccepting: provider.isAccepting })
        .from(provider)
        .where(eq(provider.userId, serviceRecord.providerUserId))
        .limit(1);

      if (providerRecord?.isAccepting) {
        return [serviceRecord.providerUserId];
      }

      return [];
    }

    // General service type request - get all accepting providers with enabled services
    const providersWithService = await this.dbService.db
      .select({
        providerUserId: service.providerUserId,
      })
      .from(service)
      .innerJoin(provider, eq(service.providerUserId, provider.userId))
      .where(
        and(eq(service.serviceTypeId, serviceTypeId), eq(service.isEnabled, true), eq(provider.isAccepting, true)),
      );

    // Remove duplicates
    const uniqueProviders = [...new Set(providersWithService.map(p => p.providerUserId))];
    return uniqueProviders;
  }

  // Get full request details including related data
  async getRequestDetails(requestId: string): Promise<RequestDetails | null> {
    const [requestRecord] = await this.dbService.db
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
      .where(eq(request.id, requestId))
      .limit(1);

    if (!requestRecord) {
      return null;
    }

    // Get service type
    const [serviceTypeRecord] = await this.dbService.db
      .select({
        id: serviceType.id,
        name: serviceType.name,
        iconUrl: serviceType.iconUrl,
      })
      .from(serviceType)
      .where(eq(serviceType.id, requestRecord.serviceTypeId))
      .limit(1);

    // Get seeker info
    const [seekerRecord] = await this.dbService.db
      .select({
        userId: seeker.userId,
      })
      .from(seeker)
      .where(eq(seeker.userId, requestRecord.seekerUserId))
      .limit(1);

    const [userRecord] = await this.dbService.db
      .select({
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        phoneNumber: user.phoneNumber,
      })
      .from(user)
      .where(eq(user.id, requestRecord.seekerUserId))
      .limit(1);

    // Get address
    const [addressRecord] = await this.dbService.db
      .select({
        id: address.id,
        label: address.label,
        coordinates: address.coordinates,
      })
      .from(address)
      .where(eq(address.id, requestRecord.addressId))
      .limit(1);

    // Get images
    const imageRecords = await this.dbService.db
      .select({ image: requestImage.image })
      .from(requestImage)
      .where(eq(requestImage.requestId, requestId));

    return {
      ...requestRecord,
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
  }

  // Delete a request and its related data
  async deleteRequest(requestId: string): Promise<boolean> {
    try {
      // Delete request images first (due to foreign key constraint)
      await this.dbService.db.delete(requestImage).where(eq(requestImage.requestId, requestId));

      // Get the address ID before deleting the request
      const [requestRecord] = await this.dbService.db
        .select({ addressId: request.addressId })
        .from(request)
        .where(eq(request.id, requestId))
        .limit(1);

      if (!requestRecord) {
        return false;
      }

      // Delete the request
      await this.dbService.db.delete(request).where(eq(request.id, requestId));

      // Delete the address
      await this.dbService.db.delete(address).where(eq(address.id, requestRecord.addressId));

      return true;
    } catch (error) {
      this.logger.error(`Failed to delete request ${requestId}:`, error);
      return false;
    }
  }

  /**
   * Get request ID by service type for a seeker (for watching)
   */
  async getRequestBySeekerAndServiceType(seekerUserId: string, serviceTypeId: string): Promise<string | null> {
    const [requestRecord] = await this.dbService.db
      .select({ id: request.id })
      .from(request)
      .where(
        and(
          eq(request.seekerUserId, seekerUserId),
          eq(request.serviceTypeId, serviceTypeId),
          eq(request.status, 'pending'),
        ),
      )
      .orderBy(request.createdAt)
      .limit(1);

    return requestRecord?.id || null;
  }
}

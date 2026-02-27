import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { provider, review, service, serviceType, user } from '@repo/database';
import { S3Service } from 'src/s3/s3.service';

import { DatabaseService } from '../database/database.service';

import { CreateServiceSwaggerDto } from './dto/create-service.dto';
import { UpdateServiceSwaggerDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  async searchServices(query: string, serviceTypeId?: string) {
    if (!query && !serviceTypeId) {
      return [];
    }

    const searchPattern = `%${query}%`;

    const services = await this.dbService.db
      .select({
        serviceId: service.id,
        serviceName: serviceType.name,
        serviceTypeName: serviceType.name,
        providerName: sql<string>`CONCAT(${user.firstName}, ' ', ${user.lastName})`,
        providerAvatar: user.avatarUrl,
        initialCost: service.initialCost,
        avgRating: sql`COALESCE(AVG(${review.rating}), 0)`.mapWith(Number),
        reviewCount: sql`COUNT(DISTINCT ${review.id})`.mapWith(Number),
      })
      .from(service)
      .innerJoin(provider, eq(service.providerUserId, provider.userId))
      .innerJoin(user, eq(provider.userId, user.id))
      .innerJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .leftJoin(review, eq(service.id, review.serviceId))
      .where(
        and(
          eq(service.isEnabled, true),
          serviceTypeId ? eq(service.serviceTypeId, serviceTypeId) : undefined,
          query
            ? or(
                ilike(serviceType.name, searchPattern),
                ilike(sql<string>`CONCAT(${user.firstName}, ' ', ${user.lastName})`, searchPattern),
              )
            : undefined,
        ),
      )
      .groupBy(service.id, user.id, serviceType.id)
      .orderBy(desc(sql`AVG(${review.rating})`))
      .limit(20);

    for (const service of services) {
      if (service.providerAvatar) {
        service.providerAvatar = await this.s3Service.getSignedUrl(service.providerAvatar);
      }
    }

    return services;
  }

  async getFeaturedServices(limit = 10) {
    const services = await this.dbService.db
      .select({
        serviceId: service.id,
        serviceName: serviceType.name,
        serviceTypeName: serviceType.name,
        providerName: sql<string>`CONCAT(${user.firstName}, ' ', ${user.lastName})`,
        providerAvatar: user.avatarUrl,
        initialCost: service.initialCost,
        avgRating: sql`COALESCE(AVG(${review.rating}), 0)`.mapWith(Number),
        reviewCount: sql`COUNT(DISTINCT ${review.id})`.mapWith(Number),
      })
      .from(service)
      .innerJoin(provider, eq(service.providerUserId, provider.userId))
      .innerJoin(user, eq(provider.userId, user.id))
      .innerJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .leftJoin(review, eq(service.id, review.serviceId))
      .where(eq(service.isEnabled, true))
      .groupBy(service.id, user.id, serviceType.id)
      .orderBy(desc(sql`AVG(${review.rating})`))
      .limit(limit);

    for (const service of services) {
      if (service.providerAvatar) {
        service.providerAvatar = await this.s3Service.getSignedUrl(service.providerAvatar);
      }
    }

    return services;
  }

  async getServiceById(serviceId: string) {
    const [serviceData] = await this.dbService.db
      .select({
        id: service.id,
        initialCost: service.initialCost,
        isEnabled: service.isEnabled,
        serviceTypeId: serviceType.id,
        serviceTypeName: serviceType.name,
        providerName: sql<string>`CONCAT(${user.firstName}, ' ', ${user.lastName})`,
        providerAvatar: user.avatarUrl,
        avgRating: sql`COALESCE(AVG(${review.rating}), 0)`.mapWith(Number),
        reviewCount: sql`COUNT(DISTINCT ${review.id})`.mapWith(Number),
      })
      .from(service)
      .innerJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .innerJoin(provider, eq(service.providerUserId, provider.userId))
      .innerJoin(user, eq(provider.userId, user.id))
      .leftJoin(review, eq(service.id, review.serviceId))
      .where(eq(service.id, serviceId))
      .groupBy(service.id, user.id, serviceType.id);

    if (serviceData.providerAvatar) {
      serviceData.providerAvatar = await this.s3Service.getSignedUrl(serviceData.providerAvatar);
    }

    if (!serviceData) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    return serviceData;
  }

  async getServiceReviews(serviceId: string) {
    const reviews = await this.dbService.db
      .select({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        reviewerName: sql<string>`CONCAT(${user.firstName}, ' ', ${user.lastName})`,
        reviewerAvatar: user.avatarUrl,
      })
      .from(review)
      .innerJoin(user, eq(review.reviewerUserId, user.id))
      .where(eq(review.serviceId, serviceId))
      .orderBy(desc(review.createdAt))
      .limit(50);

    for (const review of reviews) {
      if (review.reviewerAvatar) {
        review.reviewerAvatar = await this.s3Service.getSignedUrl(review.reviewerAvatar);
      }
    }

    return reviews;
  }

  async createService(createServiceDto: CreateServiceSwaggerDto) {
    const [newService] = await this.dbService.db.insert(service).values(createServiceDto).returning();
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
      .orderBy(desc(service.isEnabled));

    return services;
  }

  async updateService(id: string, updateServiceDto: UpdateServiceSwaggerDto) {
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

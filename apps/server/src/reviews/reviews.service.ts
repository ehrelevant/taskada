import { and, eq } from 'drizzle-orm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { booking, review, service } from '@repo/database';

import { DatabaseService } from '../database/database.service';

import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly dbService: DatabaseService) {}

  async createReview(reviewerUserId: string, createReviewDto: CreateReviewDto) {
    const { serviceId, bookingId, rating, comment } = createReviewDto;

    // Validate rating range
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Verify service exists
    const [serviceRecord] = await this.dbService.db.select().from(service).where(eq(service.id, serviceId)).limit(1);

    if (!serviceRecord) {
      throw new NotFoundException('Service not found');
    }

    // Verify booking exists and is completed
    const [bookingRecord] = await this.dbService.db.select().from(booking).where(eq(booking.id, bookingId)).limit(1);

    if (!bookingRecord) {
      throw new NotFoundException('Booking not found');
    }

    if (bookingRecord.status !== 'completed') {
      throw new BadRequestException('Cannot review a booking that is not completed');
    }

    // Check if review already exists for this booking by this user
    const [existingReview] = await this.dbService.db
      .select()
      .from(review)
      .where(and(eq(review.serviceId, serviceId), eq(review.reviewerUserId, reviewerUserId)))
      .limit(1);

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this service');
    }

    // Create the review
    const [newReview] = await this.dbService.db
      .insert(review)
      .values({
        serviceId,
        reviewerUserId,
        rating,
        comment: comment || null,
      })
      .returning();

    return newReview;
  }

  async getServiceReviews(serviceId: string) {
    const reviews = await this.dbService.db
      .select()
      .from(review)
      .where(eq(review.serviceId, serviceId))
      .orderBy(review.createdAt);

    return reviews;
  }
}

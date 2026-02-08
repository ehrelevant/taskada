import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Session } from '@nestjs/common';
import { UserSession } from '@thallesp/nestjs-better-auth';

import { ReviewsService } from './reviews.service';

import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or booking not completed' })
  @ApiResponse({ status: 404, description: 'Service or booking not found' })
  async createReview(@Session() { user }: UserSession, @Body() createReviewDto: CreateReviewDto) {
    return await this.reviewsService.createReview(user.id, createReviewDto);
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Get all reviews for a service' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async getServiceReviews(@Param('serviceId') serviceId: string) {
    return await this.reviewsService.getServiceReviews(serviceId);
  }
}

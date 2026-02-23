import { Body, Controller, Get, Param, Post, Query, Session, UploadedFiles, UseInterceptors, UsePipes } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { S3Service } from '../s3/s3.service';

import { MessagesService } from './messages.service';

import { CreateMessageSchema } from './dto/create-message.dto';
import { CreateMessageSwaggerDto } from './dto/create-message-swagger.dto';

@Controller('bookings/:bookingId/messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  async getMessages(
    @Param('bookingId') bookingId: string,
    @Session() { user }: UserSession,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return await this.messagesService.getMessagesForBooking(bookingId, user.id, parsedLimit, parsedOffset);
  }

  @Post()
  @UsePipes(new ValibotPipe(CreateMessageSchema))
  async createMessage(
    @Param('bookingId') bookingId: string,
    @Body() createMessageDto: CreateMessageSwaggerDto,
    @Session() { user }: UserSession,
  ) {
    return await this.messagesService.createMessage({
      bookingId,
      userId: user.id,
      message: createMessageDto.message,
      imageKeys: createMessageDto.imageKeys || [],
    });
  }

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadMessageImages(
    @Param('bookingId') bookingId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Session() { user }: UserSession,
  ) {
    await this.messagesService.verifyUserInBooking(bookingId, user.id);

    if (!files || files.length === 0) {
      return { error: 'No files provided' };
    }

    if (files.length > 4) {
      return { error: 'Maximum 4 images allowed' };
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const invalidFiles = files.filter(f => !allowedMimeTypes.includes(f.mimetype));
    if (invalidFiles.length > 0) {
      return { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' };
    }

    const uploadPromises = files.map(async file => {
      const result = await this.s3Service.uploadFile(file, `messages/${bookingId}`, user.id);
      return result.key;
    });

    const imageKeys = await Promise.all(uploadPromises);

    return { imageKeys };
  }
}

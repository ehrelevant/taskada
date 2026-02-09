import { Body, Controller, Get, Param, Post, Query, Session, UsePipes } from '@nestjs/common';
import { UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { MessagesService } from './messages.service';

import { CreateMessageSchema } from './dto/create-message.dto';
import { CreateMessageSwaggerDto } from './dto/create-message-swagger.dto';

@Controller('bookings/:bookingId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

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
    });
  }
}

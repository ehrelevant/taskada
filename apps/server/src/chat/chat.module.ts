import { Module } from '@nestjs/common';

import { MessagesModule } from '../messages/messages.module';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';

import { ChatGateway } from './chat.gateway';

@Module({
  imports: [MessagesModule],
  providers: [ChatGateway, PushNotificationsService],
  exports: [ChatGateway],
})
export class ChatModule {}

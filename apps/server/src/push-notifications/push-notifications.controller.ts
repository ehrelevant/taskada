import { Body, Controller, Delete, Post, Session } from '@nestjs/common';
import { UserSession } from '@thallesp/nestjs-better-auth';

import { PushNotificationsService } from './push-notifications.service';

interface RegisterTokenDto {
  token: string;
  platform: string;
}

interface UnregisterTokenDto {
  token: string;
}

@Controller('push-notifications')
export class PushNotificationsController {
  constructor(private readonly pushNotificationsService: PushNotificationsService) {}

  @Post('register')
  async registerToken(@Session() { user }: UserSession, @Body() body: RegisterTokenDto) {
    await this.pushNotificationsService.registerPushToken(user.id, body.token, body.platform);
    return { message: 'Push token registered successfully' };
  }

  @Delete('unregister')
  async unregisterToken(@Session() { user }: UserSession, @Body() body: UnregisterTokenDto) {
    await this.pushNotificationsService.unregisterPushToken(user.id, body.token);
    return { message: 'Push token unregistered successfully' };
  }
}

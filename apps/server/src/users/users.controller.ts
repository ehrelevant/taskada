import { Body, Controller, Get, Put, UsePipes } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { UsersService } from './users.service';

import { ChangePasswordSchema, UpdateUserProfileSchema } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getUserProfile(@Session() { user: { id: userId } }: UserSession) {
    return await this.usersService.getUserProfile(userId);
  }

  @Put('profile')
  @UsePipes(new ValibotPipe(UpdateUserProfileSchema))
  async updateUserProfile(
    @Session() { user: { id: userId } }: UserSession,
    @Body() updateData: Record<string, unknown>,
  ) {
    return await this.usersService.updateUserProfile(userId, updateData);
  }

  @Put('password')
  @UsePipes(new ValibotPipe(ChangePasswordSchema))
  async changePassword(
    @Session() { user: { id: userId } }: UserSession,
    @Body() passwordData: { oldPassword: string; newPassword: string },
  ) {
    return await this.usersService.changePassword(userId, passwordData.oldPassword, passwordData.newPassword);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Session,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { UsersService } from './users.service';

import { ChangePasswordSchema, UpdateUserProfileSchema } from './dto/user.dto';
import { ChangePasswordSwaggerDto, UpdateUserProfileSwaggerDto } from './dto/user-swagger.dto';

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
    @Body() updateData: UpdateUserProfileSwaggerDto,
  ) {
    return await this.usersService.updateUserProfile(userId, updateData);
  }

  @Put('password')
  @UsePipes(new ValibotPipe(ChangePasswordSchema))
  async changePassword(
    @Session() { user: { id: userId } }: UserSession,
    @Body() passwordData: ChangePasswordSwaggerDto,
  ) {
    return await this.usersService.changePassword(userId, passwordData.oldPassword, passwordData.newPassword);
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadAvatar(@Session() { user: { id: userId } }: UserSession, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file provided' };
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' };
    }

    return await this.usersService.uploadAvatar(userId, file);
  }

  @Delete('avatar')
  async deleteAvatar(@Session() { user: { id: userId } }: UserSession) {
    return await this.usersService.deleteAvatar(userId);
  }
}

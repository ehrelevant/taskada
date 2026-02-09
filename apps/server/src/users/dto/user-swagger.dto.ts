import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileSwaggerDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Middle name of the user', example: 'A', required: false })
  middleName?: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'Phone number of the user', example: '+1234567890' })
  phoneNumber: string;

  @ApiProperty({
    description: 'URL to the user avatar image',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatarUrl?: string;
}

export class ChangePasswordSwaggerDto {
  @ApiProperty({ description: 'Current password', example: 'oldPassword123' })
  oldPassword: string;

  @ApiProperty({ description: 'New password (minimum 8 characters)', example: 'newPassword456' })
  newPassword: string;
}

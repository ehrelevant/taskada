import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'User email', example: 'jane@example.com' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'strong_password_123' })
  password: string;

  @ApiProperty({ description: 'Phone Number', example: '09991231234' })
  phoneNumber: string;

  @ApiProperty({ description: 'First Name', example: 'Jane' })
  name: string;

  @ApiProperty({ description: 'Middle Name', example: 'Sasha' })
  middleName: string;

  @ApiProperty({ description: 'Last Name', example: 'Doe' })
  lastName: string;

  //   @ApiProperty({ description: 'Profile image URL', required: false, example: 'https://example.com/avatar.jpg' })
  //   image?: string;

  //   @ApiProperty({ description: 'Optional callback URL for email verification', required: false })
  //   callbackURL?: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'User email', example: 'jane@example.com' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'strong_password_123' })
  password: string;
}

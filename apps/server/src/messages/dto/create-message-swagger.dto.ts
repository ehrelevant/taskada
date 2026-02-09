import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageSwaggerDto {
  @ApiProperty({
    description: 'The message content',
    example: 'Hello, I will arrive in 10 minutes',
  })
  message: string;
}

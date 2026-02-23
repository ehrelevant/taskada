import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageSwaggerDto {
  @ApiProperty({
    description: 'The message content',
    example: 'Hello, I will arrive in 10 minutes',
  })
  message: string;

  @ApiProperty({
    description: 'S3 keys for attached images',
    example: ['messages/booking-id/1234567890.jpg'],
    required: false,
    type: [String],
  })
  imageKeys?: string[];
}

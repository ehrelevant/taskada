import { ApiProperty } from '@nestjs/swagger';

export class CreateSeekerSwaggerDto {
  @ApiProperty({
    description: 'The user ID of the seeker',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;
}

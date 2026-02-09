import { ApiProperty } from '@nestjs/swagger';

export class UpdateRequestStatusSwaggerDto {
  @ApiProperty({
    description: 'The new status for the request',
    enum: ['pending', 'settling'],
    example: 'settling',
  })
  status: 'pending' | 'settling';
}

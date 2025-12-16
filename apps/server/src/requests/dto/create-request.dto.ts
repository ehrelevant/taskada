import { ApiProperty } from '@nestjs/swagger';
import { NewRequest } from '@repo/database';

export class CreateRequestDto implements NewRequest {
  @ApiProperty()
  serviceTypeId: string;

  @ApiProperty()
  seekerUserId: string;

  @ApiProperty()
  addressId: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  images?: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { type NewService } from '@repo/database';

export class CreateServiceDto implements NewService {
  @ApiProperty()
  serviceTypeId: string;

  @ApiProperty()
  providerUserId: string;

  @ApiProperty()
  initialCost: number;

  @ApiProperty()
  isEnabled?: boolean;
}

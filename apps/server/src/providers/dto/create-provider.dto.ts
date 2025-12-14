import { ApiProperty } from '@nestjs/swagger';
import { NewProvider } from '@repo/database';

export class CreateProviderDto implements NewProvider {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  agencyId?: string;

  @ApiProperty()
  isAccepting?: boolean;
}

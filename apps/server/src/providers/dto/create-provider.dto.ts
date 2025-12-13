import * as v from 'valibot';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderInsertSchema } from '@repo/database';

export class CreateProviderDto implements v.InferInput<typeof ProviderInsertSchema> {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  agencyId?: string;

  @ApiProperty()
  isAccepting?: boolean;
}

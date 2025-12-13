import { ApiProperty } from '@nestjs/swagger';
import { type InferInput } from 'valibot';
import { ProviderInsertSchema } from '@repo/database';

export class CreateProviderDto implements InferInput<typeof ProviderInsertSchema> {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  agencyId?: string;

  @ApiProperty()
  isAccepting?: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { NewSeeker } from '@repo/database';

export class CreateSeekerDto implements NewSeeker {
  @ApiProperty()
  userId: string;
}

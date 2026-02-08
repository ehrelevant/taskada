import { ApiProperty } from '@nestjs/swagger';

export class SubmitProposalDto {
  @ApiProperty()
  cost: number;

  @ApiProperty()
  specifications: string;
}

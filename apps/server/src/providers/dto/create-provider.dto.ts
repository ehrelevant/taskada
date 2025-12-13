import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateProviderDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  agencyId?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isAccepting?: boolean;
}

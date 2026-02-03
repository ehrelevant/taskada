import { ApiProperty } from '@nestjs/swagger';
import { array, minLength, number, object, optional, pipe, string } from 'valibot';

export class CreateRequestDto {
  @ApiProperty()
  serviceTypeId: string;

  @ApiProperty({ required: false })
  serviceId?: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  addressLabel: string;

  @ApiProperty({ required: false })
  imageUrls?: string[];
}

export const CreateRequestSchema = object({
  serviceTypeId: string(),
  serviceId: optional(string()),
  description: pipe(string(), minLength(10, 'Description must be at least 10 characters')),
  latitude: number(),
  longitude: number(),
  addressLabel: pipe(string(), minLength(5, 'Please enter a valid address')),
  imageUrls: optional(array(string())),
});

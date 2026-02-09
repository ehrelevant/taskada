import { ApiProperty } from '@nestjs/swagger';
import { InferOutput, minLength, minValue, number, object, pipe, string } from 'valibot';

export const SubmitProposalSchema = object({
  cost: pipe(number(), minValue(0, 'Cost must be a positive number')),
  specifications: pipe(string(), minLength(1, 'Specifications cannot be empty')),
});

export type SubmitProposalDto = InferOutput<typeof SubmitProposalSchema>;

export class SubmitProposalSwaggerDto {
  @ApiProperty({
    description: 'The proposed cost for the service',
    example: 1500.0,
    minimum: 0,
  })
  cost: number;

  @ApiProperty({
    description: 'Detailed specifications for the service',
    example: 'Install new kitchen sink with garbage disposal',
  })
  specifications: string;
}

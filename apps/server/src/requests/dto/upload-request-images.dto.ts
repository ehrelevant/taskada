import { ApiProperty } from '@nestjs/swagger';
import { array, InferOutput, minLength, object, pipe, string } from 'valibot';

export const UploadRequestImagesSchema = object({
  imageUrls: pipe(
    array(pipe(string(), minLength(1, 'Image URL cannot be empty'))),
    minLength(1, 'At least one image URL is required'),
  ),
});

export type UploadRequestImagesDto = InferOutput<typeof UploadRequestImagesSchema>;

export class UploadRequestImagesSwaggerDto {
  @ApiProperty({
    description: 'Array of image URLs to upload',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    type: [String],
  })
  imageUrls: string[];
}

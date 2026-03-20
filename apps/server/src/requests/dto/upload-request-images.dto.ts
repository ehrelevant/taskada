import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UploadRequestImagesSchema = z.object({
  imageUrls: z.array(z.string().min(1, 'Image URL cannot be empty')).min(1, 'At least one image URL is required'),
});

export class UploadRequestImagesDto extends createZodDto(UploadRequestImagesSchema) {}

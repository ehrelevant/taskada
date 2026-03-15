import * as z from 'zod';

import { MetadataSchema } from '@standard/schema';

export const ItemSchema = z
  .object({
    reference_id: z
      .string()
      .min(1)
      .max(255)
      .meta({ description: 'Merchant provided identifier for the item.', example: 'item-1' }),
    type: z
      .enum(['DIGITAL_PRODUCT', 'PHYSICAL_PRODUCT', 'DIGITAL_SERVICE', 'PHYSICAL_SERVICE', 'FEE'])
      .meta({ description: 'Type of item.' }),
    name: z.string().min(1).max(255).meta({ description: 'Name of item.' }),
    net_unit_amount: z.number().meta({ description: 'Net amount to be charged per unit.' }),
    quantity: z.number().min(1).meta({ description: 'Number of units of this item in the basket.' }),
    url: z.string().optional().meta({ description: 'URL of the item. Must be HTTPS or HTTP.' }),
    image_url: z.string().optional().meta({ description: 'URL of the image of the item. Must be HTTPS or HTTP.' }),
    category: z.string().max(255).optional().meta({ description: 'Category for item.' }),
    subcategory: z.string().max(255).optional().meta({ description: 'Sub-category for item.' }),
    description: z.string().max(255).optional().meta({ description: 'Description of item.' }),
    metadata: MetadataSchema.optional(),
  })
  .meta({ description: 'Item object for session', example: [{ reference_id: 'item-1', name: 'Product' }] });

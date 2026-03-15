import * as z from 'zod';

import {
  CancelSessionRequestSchema,
  ChannelPropertiesPaySchema,
  ChannelPropertiesSaveSchema,
  CreateSessionRequestSchema,
  GetSessionStatusRequestSchema,
  ItemSchema,
  SessionCustomerDetailsSchema,
  SessionIndividualDetailSchema,
  SessionResponseSchema,
} from './schema';

export type SessionCustomer = z.infer<typeof SessionCustomerDetailsSchema>;
export type SessionIndividualDetail = z.infer<typeof SessionIndividualDetailSchema>;
export type CreateSessionRequest = z.input<typeof CreateSessionRequestSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type CancelSessionRequest = z.input<typeof CancelSessionRequestSchema>;
export type ChannelPropertiesPay = z.infer<typeof ChannelPropertiesPaySchema>;
export type ChannelPropertiesSave = z.infer<typeof ChannelPropertiesSaveSchema>;
export type GetSessionStatusRequest = z.input<typeof GetSessionStatusRequestSchema>;
export type SessionResponse = z.infer<typeof SessionResponseSchema>;

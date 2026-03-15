import * as z from 'zod';

import {
  CancelSessionRequestSchema,
  CancelSessionResponseSchema,
  ChannelPropertiesPaySchema,
  ChannelPropertiesSaveSchema,
  CreateSessionRequestSchema,
  CreateSessionResponseSchema,
  GetSessionStatusRequestSchema,
  GetSessionStatusResponseSchema,
  ItemSchema,
  SessionCustomerDetailsSchema,
  SessionIndividualDetailSchema,
} from './schema';

export type SessionCustomer = z.infer<typeof SessionCustomerDetailsSchema>;
export type SessionIndividualDetail = z.infer<typeof SessionIndividualDetailSchema>;
export type CreateSessionRequest = z.input<typeof CreateSessionRequestSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type CancelSessionRequest = z.input<typeof CancelSessionRequestSchema>;
export type ChannelPropertiesPay = z.infer<typeof ChannelPropertiesPaySchema>;
export type ChannelPropertiesSave = z.infer<typeof ChannelPropertiesSaveSchema>;
export type GetSessionStatusRequest = z.input<typeof GetSessionStatusRequestSchema>;
export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;
export type CancelSessionResponse = z.infer<typeof CancelSessionResponseSchema>;
export type GetSessionStatusResponse = z.infer<typeof GetSessionStatusResponseSchema>;

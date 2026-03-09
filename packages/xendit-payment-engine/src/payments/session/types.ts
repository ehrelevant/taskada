import * as v from 'valibot';

import { CancelSessionRequestSchema, ChannelPropertiesPaySchema, ChannelPropertiesSaveSchema, CreateSessionRequestSchema, GetSessionStatusRequestSchema, ItemSchema, SessionCustomerDetailsSchema, SessionIndividualDetailSchema, SessionResponseSchema } from './schema';

export type SessionCustomer = v.InferInput<typeof SessionCustomerDetailsSchema>;
export type SessionIndividualDetail = v.InferInput<typeof SessionIndividualDetailSchema>;
export type CreateSessionRequest = v.InferInput<typeof CreateSessionRequestSchema>;
export type Item = v.InferInput<typeof ItemSchema>;
export type CancelSessionRequest = v.InferInput<typeof CancelSessionRequestSchema>;
export type ChannelPropertiesPay = v.InferInput<typeof ChannelPropertiesPaySchema>;
export type ChannelPropertiesSave = v.InferInput<typeof ChannelPropertiesSaveSchema>;
export type GetSessionStatusRequest = v.InferInput<typeof GetSessionStatusRequestSchema>;
export type SessionResponse = v.InferInput<typeof SessionResponseSchema>;

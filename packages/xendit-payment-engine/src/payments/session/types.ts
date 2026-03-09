import type z from "zod";

import {
    CancelSessionRequestSchema,
    ChannelPropertiesPaySchema,
    ChannelPropertiesSaveSchema,
    CreateSessionRequestSchema,
    CustomerDetailsSchema,
    GetSessionStatusRequestSchema,
    IndividualDetailSchema,
    ItemSchema,
    SessionResponseSchema,
} from "./schema";

export type Customer = z.infer<typeof CustomerDetailsSchema>;
export type IndividualDetail = z.infer<typeof IndividualDetailSchema>;
export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type CancelSessionRequest = z.infer<typeof CancelSessionRequestSchema>;
export type ChannelPropertiesPay = z.infer<typeof ChannelPropertiesPaySchema>;
export type ChannelPropertiesSave = z.infer<typeof ChannelPropertiesSaveSchema>;
export type GetSessionStatusRequest = z.infer<typeof GetSessionStatusRequestSchema>;
export type SessionResponse = z.infer<typeof SessionResponseSchema>;

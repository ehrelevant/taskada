import client from '@src/client';

import type {
  CancelSessionRequest,
  CancelSessionResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  GetSessionStatusRequest,
  GetSessionStatusResponse,
} from './types';
import {
  CancelSessionRequestSchema,
  CancelSessionResponseSchema,
  CreateSessionRequestSchema,
  CreateSessionResponseSchema,
  GetSessionStatusRequestSchema,
  GetSessionStatusResponseSchema,
} from './schema';

export async function create_session(request: CreateSessionRequest): Promise<CreateSessionResponse> {
  const validated_request = CreateSessionRequestSchema.parse(request);
  const response = await client.post('sessions', { body: JSON.stringify(validated_request) });

  return CreateSessionResponseSchema.parse(await response.json());
}

export async function get_session_status(request: GetSessionStatusRequest): Promise<GetSessionStatusResponse> {
  const validated_request = GetSessionStatusRequestSchema.parse(request);
  const response = await client.get(`sessions/${validated_request.session_id}`);

  return GetSessionStatusResponseSchema.parse(await response.json());
}

export async function cancel_session(request: CancelSessionRequest): Promise<CancelSessionResponse> {
  const validated_request = CancelSessionRequestSchema.parse(request);
  const response = await client.post(`sessions/${validated_request.session_id}/cancel`).catch();

  return CancelSessionResponseSchema.parse(await response.json());
}

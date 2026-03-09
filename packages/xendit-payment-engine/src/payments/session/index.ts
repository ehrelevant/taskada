import * as v from 'valibot';
import client from '@src/client';
import { ErrorResponseSchema } from '@standard/schema';
import type { KyResponse } from 'ky';

import type { CancelSessionRequest, CreateSessionRequest, GetSessionStatusRequest, SessionResponse } from './types';
import {
  CancelSessionRequestSchema,
  CreateSessionRequestSchema,
  GetSessionStatusRequestSchema,
  SessionResponseSchema,
} from './schema';

async function handle_error(response: KyResponse, message?: string): Promise<void> {
  if (!response.ok) {
    const error_message = v.parse(ErrorResponseSchema, await response.json());
    throw new Error(
      `${message ?? 'An error occurred while processing the session'} due to ${error_message.error_code}`,
    );
  }
}

export async function create_session(request: CreateSessionRequest): Promise<SessionResponse> {
  const validated_request = v.parse(CreateSessionRequestSchema, request);
  const response = await client.post('sessions', { body: JSON.stringify(validated_request) });

  await handle_error(response);

  return v.parse(SessionResponseSchema, await response.json());
}

export async function get_session_status(request: GetSessionStatusRequest): Promise<SessionResponse> {
  const validated_request = v.parse(GetSessionStatusRequestSchema, request);
  const response = await client.get(`sessions/${validated_request.session_id}`);

  await handle_error(response);

  return v.parse(SessionResponseSchema, await response.json());
}

export async function cancel_session(request: CancelSessionRequest): Promise<SessionResponse> {
  const validated_request = v.parse(CancelSessionRequestSchema, request);
  const response = await client.post(`sessions/${validated_request.session_id}/cancel`);

  await handle_error(response);

  return v.parse(SessionResponseSchema, await response.json());
}

export * from './types';

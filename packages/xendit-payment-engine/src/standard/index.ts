import type { KyResponse } from 'ky';

import { ErrorResponseSchema } from './schema';

export async function handle_error(response: KyResponse, message?: string): Promise<void> {
  if (!response.ok) {
    const error_message = ErrorResponseSchema.parse(await response.json());
    throw new Error(
      `${message ?? 'An error occurred while processing the session'} due to ${error_message.error_code}`,
    );
  }
}

export * from './types';

import logger from '@logger';
import { HTTPError } from 'ky';

import { ErrorResponseSchema } from './schema';

export async function handle_error(error: HTTPError): Promise<HTTPError> {
  const { response } = error;

  if (response.url.includes('xendit')) {
    const error_message = ErrorResponseSchema.parse(await response.json());
    error.name = 'XenditError';
    logger.error({ kyResponse: response, xenditError: error_message }, 'Xendit API error');
  }

  return error;
}

import * as z from 'zod';
import ky from 'ky';
import logger from '@logger';
import { Buffer } from 'buffer';
import { handle_error } from '@standard/index';
import type { KyResponseWithRequest } from '@src/types';

const API_URL = z.string('Environment variable `XENDIT_API_URL` is missing.').parse(process.env.XENDIT_API_URL);
const secret_key = z
  .string('Environment variable `XENDIT_CLIENT_SECRET` is missing.')
  .parse(process.env.XENDIT_CLIENT_SECRET);
const encoded: string = Buffer.from(`${secret_key}:`).toString('base64');

const client = ky.create({
  prefixUrl: API_URL,
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
    authorization: `Basic ${encoded}`,
  },
  credentials: 'same-origin',
  hooks: {
    afterResponse: [
      (request, _options, response): KyResponseWithRequest => {
        const r = response as KyResponseWithRequest;
        r.request = request;
        logger.debug({ kyResponse: r });
        return r;
      },
    ],
    beforeError: [handle_error],
  },
});

export default client;

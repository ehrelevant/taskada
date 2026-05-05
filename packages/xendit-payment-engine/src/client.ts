import * as z from 'zod';
import ky from 'ky';
import { Buffer } from 'buffer';
import { getLogger } from '.';
import { handle_error } from '@standard/index';

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
      (_request, _options, response) => {
        function getHeaders(obj: { headers: { entries: () => HeadersIterator<[string, string]> } }) {
          try {
            const ret: Record<string, string> = Object.fromEntries(obj.headers.entries());

            return ret;
          } catch {
            return {};
          }
        }

        const url = new URL(_request.url, API_URL);
        let reqQuery = {};
        let reqParams = {};
        try {
          reqQuery = Object.fromEntries(url.searchParams.entries());
          reqParams = { path: url.pathname.substring(1).split('/') }; // substring(1) to remove the leading slash
        } catch {
          // do nothing
        }

        getLogger().info(
          {
            req: {
              method: _request.method,
              url: _request.url,
              headers: getHeaders(_request),
              params: reqParams,
              query: reqQuery,
            },
            res: {
              statusCode: response.status,
              headers: getHeaders(response),
            },
          },
          'request completed',
        );
        return response;
      },
    ],
    beforeError: [handle_error],
  },
});

export default client;

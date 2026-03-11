import * as v from 'valibot';
import ky from 'ky';
import { Buffer } from 'buffer';

const API_URL = v.parse(v.string('Environment variable `XENDIT_API_URL` is missing.'), process.env.XENDIT_API_URL);
const secret_key = v.parse(
  v.string('Environment variable `XENDIT_CLIENT_SECRET` is missing.'),
  process.env.XENDIT_CLIENT_SECRET,
);
const encoded: string = Buffer.from(`${secret_key}:`).toString('base64');

const client = ky.create({
  prefixUrl: API_URL,
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
    authorization: `Basic ${encoded}`,
  },
  credentials: 'same-origin',
});

export default client;

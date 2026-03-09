import ky from 'ky';
import { Buffer } from 'buffer';

const API_URL = process.env.API_URL;
if (API_URL === undefined) {
  throw new Error('No API URL found.');
}

const secret_key = process.env.XENDIT_CLIENT_SECRET;
if (secret_key === undefined) {
  throw new Error('No secret key found');
}
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

// Mock environment variables
process.env.XENDIT_API_URL = 'https://api.example.com';
process.env.XENDIT_CLIENT_SECRET = 'mock_secret';

import { jest } from '@jest/globals';

describe('xendit client', () => {
  afterEach(() => {
    process.env.XENDIT_API_URL = 'https://api.example.com';
    process.env.XENDIT_CLIENT_SECRET = 'mock_secret';
  });
  it('should throw if API_URL is missing', async () => {
    jest.resetModules();
    delete process.env.XENDIT_API_URL;
    await expect(import('./client')).rejects.toThrow('Environment variable `XENDIT_API_URL` is missing.');
  });

  it('should throw if XENDIT_CLIENT_SECRET is missing', async () => {
    jest.resetModules();
    delete process.env.XENDIT_CLIENT_SECRET;
    await expect(import('./client')).rejects.toThrow('Environment variable `XENDIT_CLIENT_SECRET` is missing.');
  });
});

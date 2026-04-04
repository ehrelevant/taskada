// Mock environment variables
process.env.XENDIT_API_URL = 'https://api.example.com';
process.env.XENDIT_CLIENT_SECRET = 'mock_secret';

import { jest } from '@jest/globals';

interface KyConfig {
  hooks?: {
    afterResponse?: ((request: unknown, options: unknown, response: unknown) => unknown)[];
    beforeError?: ((error: unknown) => unknown)[];
  };
}

describe('xendit client', () => {
  afterEach(() => {
    process.env.XENDIT_API_URL = 'https://api.example.com';
    process.env.XENDIT_CLIENT_SECRET = 'mock_secret';
  });
  it('should throw if API_URL is missing', async () => {
    jest.resetModules();
    delete process.env.XENDIT_API_URL;
    await expect(import('../client')).rejects.toThrow('Environment variable `XENDIT_API_URL` is missing.');
  });

  it('should throw if XENDIT_CLIENT_SECRET is missing', async () => {
    jest.resetModules();
    delete process.env.XENDIT_CLIENT_SECRET;
    await expect(import('../client')).rejects.toThrow('Environment variable `XENDIT_CLIENT_SECRET` is missing.');
  });
});

describe('ky hook', () => {
  it('afterResponse should attach request to response', async () => {
    jest.resetModules();
    let capturedConfig: KyConfig | undefined = undefined;
    await jest.unstable_mockModule('ky', () => {
      class HTTPError extends Error {
        response: unknown;
        request: unknown;
        options: unknown;
        data: unknown;
        constructor(message?: string) {
          super(message);
          this.name = 'HTTPError';
        }
      }

      return {
        default: {
          create: (config: KyConfig) => {
            capturedConfig = config;
            const stub = () => undefined;
            return stub;
          },
        },
        HTTPError,
      };
    });

    // Import the client after mocking ky
    await expect(import('../client')).resolves.toBeDefined();
    expect(capturedConfig).toBeDefined();
    const config = capturedConfig as unknown as KyConfig;
    const hook = config.hooks?.afterResponse?.[0];
    expect(typeof hook).toBe('function');

    const fakeRequest = { url: 'https://example.local/test', method: 'POST' };
    const fakeResponse: Record<string, unknown> = {};

    const returned = (hook as (a: unknown, b: unknown, c: unknown) => unknown)(fakeRequest, {}, fakeResponse);
    expect(returned).toBeDefined();
    expect((returned as { request?: unknown }).request).toBe(fakeRequest);
  });

  it('should call beforeError hook with handle_error', async () => {
    jest.resetModules();
    let capturedConfig: KyConfig | undefined = undefined;
    const handleErrorMock = jest.fn((e: unknown) => e);

    await jest.unstable_mockModule('@standard/index', () => ({
      handle_error: handleErrorMock,
    }));

    await jest.unstable_mockModule('ky', () => {
      class HTTPError extends Error {
        response: unknown;
        request: unknown;
        options: unknown;
        data: unknown;
        constructor(message?: string) {
          super(message);
          this.name = 'HTTPError';
        }
      }
      return {
        default: {
          create: (config: KyConfig) => {
            capturedConfig = config;
            const stub = () => undefined;
            return stub;
          },
        },
        HTTPError: HTTPError,
      };
    });

    // Import the client after mocking modules
    await expect(import('../client')).resolves.toBeDefined();
    expect(capturedConfig).toBeDefined();
    const config = capturedConfig as unknown as KyConfig;
    const beforeErrorHook = config.hooks?.beforeError?.[0];
    expect(beforeErrorHook).toBeDefined();
    expect(beforeErrorHook).toBe(handleErrorMock);
  });
});

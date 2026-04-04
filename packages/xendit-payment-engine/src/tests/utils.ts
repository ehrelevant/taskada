import { jest } from '@jest/globals';
import { STATUS_CODES } from 'http';

// Mock the `ky` module before importing `xendit` so the client created
// in the module uses our mocked `get` implementation.
interface MockKyResponse {
  status: number;
  readonly ok: boolean;
  json: () => Promise<object>;
}

class MockHTTPError extends Error {
  response: unknown;
  request: unknown;
  options: unknown;
  data: unknown;
  constructor(message?: string) {
    super(message);
    this.name = 'HTTPError';
  }
}

const mockGet = jest.fn<Promise<MockKyResponse>, unknown[]>();
const mockPost = jest.fn<Promise<MockKyResponse>, unknown[]>();
const mockPatch = jest.fn<Promise<MockKyResponse>, unknown[]>();

// Wrapper that calls the test-provided mock and throws MockHTTPError when response is not ok
async function callAndMaybeThrow(
  fn: jest.Mock<Promise<MockKyResponse>, unknown[]>,
  ...args: unknown[]
): Promise<MockKyResponse> {
  const res = await fn(...args);
  if (res.status >= 300 || res.status < 200) {
    const status_message = STATUS_CODES[res.status];
    const err = new MockHTTPError(status_message);
    err.response = res;
    throw err;
  }
  return res;
}

function mock_ky_client() {
  return {
    default: {
      create: () => ({
        get: (...args: unknown[]) => callAndMaybeThrow(mockGet, ...args),
        post: (...args: unknown[]) => callAndMaybeThrow(mockPost, ...args),
        patch: (...args: unknown[]) => callAndMaybeThrow(mockPatch, ...args),
      }),
      extend: () => ({
        get: (...args: unknown[]) => callAndMaybeThrow(mockGet, ...args),
        post: (...args: unknown[]) => callAndMaybeThrow(mockPost, ...args),
        patch: (...args: unknown[]) => callAndMaybeThrow(mockPatch, ...args),
      }),
    },
    HTTPError: MockHTTPError,
  };
}

jest.unstable_mockModule('ky', mock_ky_client);

function partial_mockKyResponse({ status, json }: { status: number; json: () => Promise<object> }): MockKyResponse {
  return {
    status,
    get ok() {
      return this.status >= 200 && this.status < 300;
    },
    json,
  };
}

export { mockGet, mockPost, mockPatch, partial_mockKyResponse, mock_ky_client, MockHTTPError };

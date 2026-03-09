import { jest } from "@jest/globals";

// Mock the `ky` module before importing `xendit` so the client created
// in the module uses our mocked `get` implementation.
interface MockKyResponse {
    status: number;
    readonly ok: boolean;
    json: () => Promise<object>;
}
const mockGet: jest.Mock<() => Promise<MockKyResponse>> = jest.fn<() => Promise<MockKyResponse>>();
const mockPost: jest.Mock<() => Promise<MockKyResponse>> = jest.fn<() => Promise<MockKyResponse>>();
jest.unstable_mockModule("ky", () => ({
    default: {
        create: () => ({ get: mockGet, post: mockPost }),
    },
}));

function partial_mockKyResponse({ status, json }: { status: number; json: () => Promise<object> }): MockKyResponse {
    return {
        status,
        get ok() {
            return this.status >= 200 && this.status < 300;
        },
        json,
    };
}

export { mockGet, mockPost, partial_mockKyResponse };

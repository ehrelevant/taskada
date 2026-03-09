// Mock environment variables
process.env.API_URL = "https://api.example.com";
process.env.XENDIT_CLIENT_SECRET = "mock_secret";

import { jest } from "@jest/globals";

describe("xendit client", () => {
    afterEach(() => {
        process.env.API_URL = "https://api.example.com";
        process.env.XENDIT_CLIENT_SECRET = "mock_secret";
    });
    it("should throw if API_URL is missing", async () => {
        jest.resetModules();
        delete process.env.API_URL;
        await expect(import("./client")).rejects.toThrow("No API URL found.");
    });

    it("should throw if XENDIT_CLIENT_SECRET is missing", async () => {
        jest.resetModules();
        delete process.env.XENDIT_CLIENT_SECRET;
        await expect(import("./client")).rejects.toThrow("No secret key found");
    });
});

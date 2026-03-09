import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const config: Config = {
    // [...]
    roots: ["src"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
        "^@customer/(.*)$": "<rootDir>/src/customer/$1",
        "^@payment/(.*)$": "<rootDir>/src/payment/$1",
        "^@payouts/(.*)$": "<rootDir>/src/payouts/$1",
        "^@src/(.*)$": "<rootDir>/src/$1",
        "^@standard/(.*)$": "<rootDir>/src/standard/$1",
    },
    ...createDefaultEsmPreset({
        useEsm: true,
    }),
};

export default config;

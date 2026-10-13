module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  setupFiles: ["<rootDir>/src/tests/setupEnv.ts"],
  testMatch: [
    "**/tests/**/*.test.ts", // Matches your test path
    "**/*.test.ts", // Fallback pattern
  ],
  modulePaths: ["<rootDir>/src"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!src/**/__mocks__/**",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/src/tests/integration/middleware/openapi.test.ts",
  ],
};

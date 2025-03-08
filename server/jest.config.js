module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
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
};

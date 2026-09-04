import type { Config } from "jest";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.models.ts',
    '!src/**/*.type.ts',
    '!src/**/index.ts',
    '!src/**/index.tsx',
    '!src/**/*.types.ts',
    '!src/**/*.interface.ts',
    '!src/common/interfaces/**',
    '!src/common/models/**',
    '!src/server/mock-db/**',
    '!src/server/mock-grid-events/**',
    '!src/mocks/**',
    '!src/**/(mocks)/**',
    '!src/**/(models)/**',
    '!src/**/*.mock.ts',
    '!src/**/*.mock.tsx',
    '!src/**/*.model.ts',
    '!src/test/**',
  ],
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    '^@pormeldev/axis-design-system$': '<rootDir>/src/test/mocks/axisDesignSystemMock.js',
    '^@pormeldev/axis-design-system/icons$': '<rootDir>/src/test/mocks/iconModuleMock.tsx',
    '^@pormeldev/axis-tw-theme-default/icons$': '<rootDir>/src/test/mocks/iconModuleMock.tsx',
    '^@pormeldev/axis-tw-theme-default/next-font$': '<rootDir>/src/test/mocks/nextFontMock.ts',
  },
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  testRegex: ".*\\.test\\.(ts|tsx)$",
  transformIgnorePatterns: [
    "/node_modules/(?!.pnpm|next-intl|use-intl|@pormeldev/next-runtime-kit)",
    "/node_modules/.pnpm/(?!(next-intl|use-intl|@pormeldev\\+next-runtime-kit)@)",
  ],
};

module.exports = createJestConfig(config);

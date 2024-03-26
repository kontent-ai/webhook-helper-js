import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  rootDir: "lib/test",
  resolver: "../../jestModuleResolver.cjs",
  transform: {
    ".*": ["ts-jest", {
      useESM: true,
      tsconfig: "tsconfig.json"
    }]
  },
}

export default jestConfig
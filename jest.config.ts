/* eslint-disable */
import type { Config } from 'jest'

export default async (): Promise<Config> => {
  return {
    verbose: true,
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/src/tests/beforeSetupTests.ts'],
    transform: {
      '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
      'node_modules/(?!(multiformats|uint8arrays|@dcl/single-sign-on-client|decentraland-connect|uuid|decentraland-dapps)/)',
    ],
  }
}

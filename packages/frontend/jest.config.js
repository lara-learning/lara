module.exports = {
  roots: ['<rootDir>/src/test'],
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { useESM: true }],
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    ENVIRONMENT: {
      supportMail: 'lara@exampleCompany.com',
    },
  },
  transformIgnorePatterns: ['/node_modules/(?!(.*\\.m?js$))'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}

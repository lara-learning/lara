module.exports = {
  roots: ['<rootDir>/src/test'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    ENVIRONMENT: {
      supportMail: 'lara@exampleCompany.com',
    },
  },
}

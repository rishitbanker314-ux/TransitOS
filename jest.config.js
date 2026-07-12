module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { 
      diagnostics: {
        ignoreCodes: [1343, 5023, 5024]
      },
      tsconfig: {
        target: 'es2020',
        module: 'commonjs',
        moduleResolution: 'node',
        jsx: 'react-jsx',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        skipLibCheck: true,
        allowJs: true
      }
    }],
  },
};

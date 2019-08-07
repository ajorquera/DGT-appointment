module.exports = {
	testPathIgnorePatterns: [
		'/node_modules/',
		'/test/exclude/'	
	],
	moduleNameMapper: {
		'^@http(.*)$': '<rootDir>/src/http$1',
		'^@utils(.*)$': '<rootDir>/src/utils$1',
		'^@background(.*)$': '<rootDir>/src/background$1'
	},

	testEnvironment: 'node',
	bail: 1,
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80
		}
	}
};
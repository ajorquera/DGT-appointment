module.exports = {
	testPathIgnorePatterns: [
		'/node_modules/',
		'/test/exclude/'	
	],
	moduleNameMapper: {
		'^@(errors|appointments|availability|notifications|utils|templates)(.*)$': '<rootDir>/src/$1$2',
	},
	collectCoverageFrom : ["src/**/*.js"],

	testEnvironment: 'node',
	bail: 1,
	coverageThreshold: {
		global: {
			branches: 40,
			functions: 30,
			lines: 50
		}
	}
};
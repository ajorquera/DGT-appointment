module.exports = {
	testPathIgnorePatterns: [
		'/node_modules/',
		'/test/exclude/'	
	],
	moduleNameMapper: {
		'^@(licenceAppointments|utils|templates)(.*)$': '<rootDir>/src/$1$2',
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
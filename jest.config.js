export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testPathIgnorePatterns: ['<rootDir>/built/', '<rootDir>/node_modules/'],
	transform: {
		'.(ts|tsx)': 'ts-jest',
	},
	testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
	moduleFileExtensions: ['ts', 'js'],
};

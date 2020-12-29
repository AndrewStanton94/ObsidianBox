import { filterObjectProperties } from './object';
const desiredKeys = ['a', 'b', 'c'];
const objects = { a: {}, b: {}, c: {} };

test('adds 1 + 2 to equal 3', () => {
	expect(1 + 2).toBe(3);
});

test('Throws exception if there are no keys', () => {
	expect(() => filterObjectProperties([], objects)).toThrow();
});

test('Throws exception if the object is empty', () => {
	expect(() => filterObjectProperties(desiredKeys, {})).toThrow();
});

test("Throws exception if any of the keys requested aren't included in the object", () => {
	expect(() => filterObjectProperties(['x'], objects)).toThrow();
});

test('The right items are returned', () => {
	expect(filterObjectProperties(desiredKeys, objects)).toEqual(objects);
});

test('The right items are returned (case insensitive)', () => {
	expect(filterObjectProperties(['A', 'B', 'C'], objects)).toEqual(objects);
});

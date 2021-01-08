/**
 * Return an object filtered to specific keys
 * @param {string[]} desiredKeys The names of the values wanted
 * @param {object} object The object containing the values
 * @returns {object} The filtered object
 *
 * @throws {Error: No keys given} No items requested
 * @throws {Error: The object is empty} Nothing to filter
 */
export const filterObjectProperties = (
	desiredKeys: string[],
	object: Record<string, unknown>
): Record<string, unknown> => {
	// Input validation
	//	Inputs are not empty
	if (desiredKeys.length < 1) {
		throw new Error('No keys given');
	}
	const objectKeys = Object.keys(object);
	if (objectKeys.length < 1) {
		throw new Error('The object is empty');
	}

	//	No invalid inputs (case insensitive)
	const desiredKeysLowerCase = desiredKeys.map((key: string) =>
		key.toLowerCase()
	);
	const objectKeysLowerCase = objectKeys.map((key: string) =>
		key.toLowerCase()
	);
	if (
		desiredKeysLowerCase.some((key) => !objectKeysLowerCase.includes(key))
	) {
		throw new Error('Unused key requested');
	}
	// /Input validation

	const desiredObjects: Record<string, unknown> = {};

	objectKeys
		.filter((key) => desiredKeysLowerCase.includes(key.toLowerCase()))
		.forEach(
			(desiredKey) => (desiredObjects[desiredKey] = object[desiredKey])
		);
	return desiredObjects;
};

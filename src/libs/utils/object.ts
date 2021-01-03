/**
 * Return an object filtered to specific keys
 * @param desiredKeys The names of the values wanted
 * @param object The object containing the values
 * @returns The filtered object
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

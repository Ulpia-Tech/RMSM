import { IdGenerator } from "./process-data";

export function binarySearch(arr, searchUri, startIndex, endIndex) {
	if (startIndex > endIndex) { return false; }

	let midIndex = Math.floor((startIndex + endIndex) / 2);
	const compareResult = checkURIs(searchUri, arr[midIndex].uri);

	if (compareResult === 0) {
		return arr[midIndex];
	}

	if (compareResult === 1) {
		return binarySearch(arr, searchUri, startIndex, midIndex - 1);
	} else if (compareResult === -1) {
		return binarySearch(arr, searchUri, midIndex + 1, endIndex);
	}
}

export function findInsertIndex(arr, uri, startIndex, endIndex) {
	if (startIndex > endIndex) { return 0; }

	let midIndex = Math.floor((startIndex + endIndex) / 2);
	const compareResult = checkURIs(uri, arr[midIndex].uri);

	if (compareResult === 1) {
		const checker = midIndex - 1 < 0;
		const shouldInsert = checker ? -1 : checkURIs(uri, arr[midIndex - 1].uri);

		if (shouldInsert === -1) {
			return midIndex;
		}
		return findInsertIndex(arr, uri, startIndex, midIndex - 1);

	} else if (compareResult === -1) {
		let checker = midIndex + 1 >= arr.length;
		const shouldInsert = checker ? 1 : checkURIs(uri, arr[midIndex + 1].uri);
		if (shouldInsert === 1) {
			return midIndex + 1;
		}
		return findInsertIndex(arr, uri, midIndex + 1, endIndex);
	}
}

function checkURIs(uri1, uri2) {
	const uri1Parts = uri1.split('/');
	const uri2Parts = uri2.split('/');

	const searchWord = uri1Parts[uri1Parts.length - 1];
	const currentWord = uri2Parts[uri2Parts.length - 1];

	return currentWord.localeCompare(searchWord);
}

export function createRolesCollection(rolesObject) {
	let rolesCollection = [];
	for (const [key, value] of Object.entries(rolesObject)) {
		rolesCollection.push({ displayName: key, tableId: value.tableId })
	}
	return rolesCollection;
}

export function findAllRoles(sortedData) {
	const rolesObject = {};
	sortedData.forEach(item => {
		item.permissions.forEach(permissionObject => {
			if (!rolesObject[permissionObject.role]) {
				rolesObject[permissionObject.role] = {
					isPresent: false,
					displayName: permissionObject.role,
					tableId: `table${IdGenerator()}`
				};
			}
		})
	})
	return rolesObject;
}

export const sortByUriLengthOrLastWordAsci = (rawData) => {
	return rawData.sort((a, b) => a.uri.split('/').length - b.uri.split('/').length || alphabeticalSortPredicateByURI(a, b));
}

export function mergeSameURI(rawData) {
	const rawDataMapper = objectifyRawData(rawData);

	return rawData.reduce((prev, curr) => {
		if (!rawDataMapper[curr.uri]) { return prev; }
		rawDataMapper[curr.uri] = false;

		let modifiedItem = { ...curr };
		modifiedItem = mergeRolesIfRepeated(curr);
		modifiedItem = mergeSameURIsPermissions(curr, rawData.filter(item => item.uri === curr.uri));

		prev.push(modifiedItem)
		return prev;
	}, [])
}

function mergeRolesIfRepeated(currentEl) {
	if (currentEl.permissions.length <= 1) { return currentEl; }

	const roleObjectMapper = objectifyRolesObjects(currentEl.permissions);

	currentEl.permissions = currentEl.permissions.reduce((prev, curr) => {
		if (!roleObjectMapper[curr.role] && !curr.filter) { return prev; }
		roleObjectMapper[curr.role] = false;

		const duplicateRoleObjectsCollection = currentEl.permissions.filter(item => item.role === curr.role && item.filter === curr.filter);
		const mergedRightsCollection = mergeRights(duplicateRoleObjectsCollection);
		curr.access = mergedRightsCollection;

		prev.push(curr);
		return prev
	}, [])

	return currentEl;
}

function mergeRights(duplicateRoleObjectsCollection) {
	let rightsSet = new Set([]);

	for (let i = 0; i < duplicateRoleObjectsCollection.length; i++) {
		if (!duplicateRoleObjectsCollection[i].access) { continue; }

		duplicateRoleObjectsCollection[i].access.forEach(right => {
			rightsSet.add(right);
		})
	}
	return Array.from(rightsSet);
}

function mergeSameURIsPermissions(currentEl, sameURIsPermissionsCollection) {
	if (sameURIsPermissionsCollection.length === 1) { return sameURIsPermissionsCollection[0]; }

	let modifiedPermissionsCollection = [];

	sameURIsPermissionsCollection.forEach(item => {
		modifiedPermissionsCollection.push(...item.permissions);
	});

	currentEl.permissions = modifiedPermissionsCollection;
	return mergeRolesIfRepeated(currentEl);
}

function objectifyRolesObjects(permissionsCollection) {
	return permissionsCollection.reduce(function (prev, curr) {
		prev[curr.role] = true;
		return prev;
	}, {});
}

function objectifyRawData(rawData) {
	return rawData.reduce(function (prev, curr) {
		prev[curr.uri] = true;
		return prev;
	}, {});
}


function alphabeticalSortPredicateByURI(a, b) {
	const aParts = a.uri.split('/');
	const bParts = b.uri.split('/');
	return aParts[aParts.length - 1].localeCompare(bParts[bParts.length - 1]);
}

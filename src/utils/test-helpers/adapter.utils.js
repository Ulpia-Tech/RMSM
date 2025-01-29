import { flat } from "../../Home/ExpandingTable/FilterAttribute/utils";

export function TestFindAllRoles(sortedData) {
	const rolesObject = {};
	sortedData.forEach(item => {
		item.permissions.forEach(permissionObject => {
			if (!rolesObject[permissionObject.role]) {
				rolesObject[permissionObject.role] = {};
			}
		})
	})
	return rolesObject;
}

export const validateUriAndId = (collection) => {
	collection.forEach(currentItem => {
		const idParts = currentItem.id.split('.');
		const uriParts = currentItem.uri.split('/');
		const isValid = uriParts.length - 1 == idParts.length;
		if (!isValid) { return false; }
	})
	return true;
}
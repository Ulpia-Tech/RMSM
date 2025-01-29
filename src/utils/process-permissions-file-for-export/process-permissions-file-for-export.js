export const ProcessPermissionsFileForExport = {}

ProcessPermissionsFileForExport.process = (permissionsFile) => {
    return flatPermissionsCollection(permissionsFile);
}

const flatPermissionsCollection = (originalRowsCollection) => {
    const flattenedCollection = []
    originalRowsCollection.forEach(item => {
        let el = flat([item])
        el = el
            .filter(currItem => currItem.permissions.length > 0)
            .map(currItem => {
                delete currItem['subRows']
                return currItem
            })
        flattenedCollection.push(...el)
    })
    return flattenedCollection;
}

const flat = (array) => {
    let result = [];
    array.forEach(function (item) {
        const modifiedItem = deleteProps(item);
        result.push(modifiedItem);
        if (Array.isArray(modifiedItem.subRows)) {
            result = result.concat(flat(modifiedItem.subRows));
        }
    });
    return result;
}

const deleteProps = (item) => {
    const newItem = { ...item }
    delete newItem['displayName'];
    delete newItem['id'];

    newItem.permissions = newItem.permissions
        .map(permissionItem => {
            if (permissionItem.access.find(accessItem => accessItem.isDerived)) { //Relying on the fact that if one is derived, all will be derived
                return null;
            }

            const newAccess = permissionItem.access
                .filter(accessItem => accessItem.hasPermission && !accessItem.isDerived)
                .map(accessItem => accessItem.accessType);

            const objectToReturn = {
                role: permissionItem.role,
                ...(permissionItem.hasOwnProperty('filter') && { filter: permissionItem.filter }),
                access: newAccess
            };

            return objectToReturn;
        })
        .filter(permissionItem => permissionItem != null); // Removing nulls in the end because we set them above for isDerived records

    return newItem;
}

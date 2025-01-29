export const Data_Processor = {}

Data_Processor.generateIdForCell = (data) => {
    data.forEach(entityObject => {
        callSubRows(entityObject);
    })
    return data;
}

function callSubRows(currentObject) {
    if (!currentObject.hasOwnProperty('permissions') || currentObject.permissions.length === 0) { return; }
    loopPermissions(currentObject.permissions);

    if (!currentObject.hasOwnProperty('subRows') || currentObject.subRows.length === 0) { return; }

    currentObject.subRows.forEach(nestedObject => {
        callSubRows(nestedObject);
    })
}

function loopPermissions(permissionsCollection) {

    permissionsCollection.forEach(permissionObject => {
        if (!permissionObject.hasOwnProperty('access') || permissionObject.access.length === 0) { return; }

        permissionObject.access.forEach(accessObject => {
            accessObject.cellId = IdGenerator();
        })
    })
}

export function IdGenerator() {
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9)
}
import { GlobalVars } from "../../../utils/globals";
import { IdGenerator } from "../../../utils/process-data";

export function loopSubRows(currentObject, mutateFunction, payloadObject) {
    if (!currentObject && currentObject.subRows.length <= 0) { return; }

    currentObject.subRows.forEach(item => {
        mutateFunction(item, payloadObject);
        loopSubRows(item, mutateFunction, payloadObject);
    })
}

export function removeFromPermissionCollection(currentObject, { tableId }) {
    for (let i = currentObject.permissions.length - 1; i >= 0; i--) {
        if (currentObject.permissions[i].tableId === tableId) {
            currentObject.permissions.splice(i, 1);
        }
    }
}

export function addToPermissionCollection(currentObject, newItem) {
    const permissionItem = {
        role: newItem.displayName,
        tableId: newItem.tableId,
        access: generateAccessCollection()
    }
    currentObject.permissions.push(permissionItem);
}

export function editPermissionsCollection(currentObject, { tableId, displayName }) {
    for (let i = 0; i <= currentObject.permissions.length - 1; i++) {
        if (currentObject.permissions[i].tableId === tableId) {
            currentObject.permissions[i] = { ...currentObject.permissions[i], role: displayName };
        }
    }
}

export function generateAccessCollection() {
    const newAccessCollection = [];
    GlobalVars.ACCESS_TYPES_COLLECTION.forEach(item => {
        newAccessCollection.push({ accessType: item, isDerived: false, hasPermission: false, cellId: IdGenerator() });
    })
    return newAccessCollection;
}

export function addToPermissionCollectionPredefined(currentObject, payloadObject) {
    const { basedOnRoleId, displayName, tableId } = payloadObject;
    const copyFromItems = currentObject.permissions.filter(item => item.tableId === basedOnRoleId);

    copyFromItems.forEach(copyFromItem => {
        const permissionItem = {
            role: displayName,
            ...('filter' in copyFromItem && { filter: copyFromItem.filter }),
            tableId,
            access: [...copyFromItem.access].map(item => { return { ...item, cellId: IdGenerator() } }) // change reference and generate new cells id's
        };

        currentObject.permissions.push(permissionItem);
    });
}

import { addToPermissionCollection, addToPermissionCollectionPredefined, editPermissionsCollection, loopSubRows, removeFromPermissionCollection } from "./utils";

export const RoleService = {};

RoleService.addRoleTable = function (originalDataCollection, newRoleObject) {
    originalDataCollection.forEach(item => {
        addToPermissionCollection(item, newRoleObject);
        loopSubRows(item, addToPermissionCollection, newRoleObject);
    })
    return originalDataCollection;
}

RoleService.removeRoleTable = function (originalDataCollection, tableId) {
    originalDataCollection.forEach(item => {
        removeFromPermissionCollection(item, { tableId });
        loopSubRows(item, removeFromPermissionCollection, { tableId });
    })
    return originalDataCollection;
}

RoleService.editRoleTable = function (originalDataCollection, { tableId, displayName }) {
    originalDataCollection.forEach(item => {
        editPermissionsCollection(item, { tableId, displayName });
        loopSubRows(item, editPermissionsCollection, { tableId, displayName });
    })

    return originalDataCollection;
}

RoleService.addRoleTableBasedOnOther = function (originalDataCollection, newRoleObject, basedOnRoleId) {
    originalDataCollection.forEach(item => {
        addToPermissionCollectionPredefined(item, { ...newRoleObject, basedOnRoleId });
        loopSubRows(item, addToPermissionCollectionPredefined, { ...newRoleObject, basedOnRoleId });
    })

    return originalDataCollection;
}
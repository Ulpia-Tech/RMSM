import { GlobalVars } from "../../../utils/globals";

export function loopSubRows(currentRow, searchedRowId, searchedTablesIdsMapper, parentRow) {
    if (!currentRow && currentRow.subRows.length <= 0) { return; }

    parentRow = currentRow;

    for (let i = 0; i < currentRow.subRows.length; i++) {
        const childRow = currentRow.subRows[i];
        if (!searchedRowId.startsWith(childRow.id)) { continue; }

        if (childRow.id === searchedRowId) {
            deriveRowValuesBasedOnParent(childRow, searchedTablesIdsMapper, parentRow);
            propagateToDerivedChildren(childRow, searchedTablesIdsMapper);
        } else {
            loopSubRows(childRow, searchedRowId, searchedTablesIdsMapper, parentRow);
        }

    }
}

export function updateParentCellValues(currentRow, searchedTablesIdsMapper) {
    currentRow.permissions.forEach((roleObject, roleIndex) => {
        if (searchedTablesIdsMapper[roleObject.tableId]) {
            roleObject.access.forEach((cellObject, cellIndex) => {
                currentRow.permissions[roleIndex].access[cellIndex] = { ...cellObject, hasPermission: false, isDerived: true };
            })
        }
    })
}

export function deriveRowValuesBasedOnParent(currentRow, searchedTablesIdsMapper, parentRow) {
    const parentPermissionsObject = objectifyPermissions(parentRow.permissions);

    for (let i = 0; i < currentRow.permissions.length; i++) {
        const roleObject = currentRow.permissions[i];

        if (!searchedTablesIdsMapper[roleObject.tableId]) { continue; }

        currentRow.permissions[i].access = roleObject.access.map(currCellObject => {
            return {
                ...currCellObject,
                hasPermission: findParentHasPermissionValue(parentPermissionsObject[roleObject.tableId], currCellObject.accessType),
                isDerived: true
            }
        })
    }
}

function findParentHasPermissionValue(parentAccessCollection, accessType) {
    const parentAccessObject = parentAccessCollection.find(accessObject => accessObject.accessType === accessType);
    return parentAccessObject.hasPermission;
}

// TODO
export function propagateToDerivedChildren(currentRow, searchedTablesIdsMapper) {
    if (!currentRow) { return; }
    // console.log('currentRow: ', currentRow);
    // console.log('searchedTablesIdsMapper: ', searchedTablesIdsMapper);

    const parentPermissionsObject = objectifyPermissions(currentRow.permissions);

    for (let i = 0; i < currentRow.subRows.length; i++) {
        const childRow = currentRow.subRows[i];

        // if (childRow.permissions[0].access[0].isDerived === false) { continue; }

        for (let j = 0; j < childRow.permissions.length; j++) {
            const roleObject = childRow.permissions[j];

            const isNotVisibleOrNotDerived = !searchedTablesIdsMapper[roleObject.tableId] || roleObject.access[0].isDerived === false;
            if (isNotVisibleOrNotDerived) { continue; }

            const access = roleObject.access.map(currCellObject => {
                return {
                    ...currCellObject,
                    hasPermission: findParentHasPermissionValue(parentPermissionsObject[roleObject.tableId], currCellObject.accessType),
                    isDerived: true
                }
            })
            childRow.permissions[j].access = access
        }

        if (currentRow.subRows.length === 0) { continue; }
        propagateToDerivedChildren(childRow, searchedTablesIdsMapper);
    }
}

export function objectifyPermissions(array) {
    return array.reduce(function (p, c) {
        p[c.tableId] = c.access;
        return p;
    }, {});
}



export function loopSubRowsBasic(currentRow, searchedRowId, cellInfo, shouldChangeFullRow) {
    if (!currentRow && currentRow.subRows.length <= 0) { return; }
    for (let i = 0; i < currentRow.subRows.length; i++) {
        const childRow = currentRow.subRows[i];

        if (!searchedRowId.startsWith(childRow.id)) { continue; }

        if (childRow.id === searchedRowId) {
            shouldChangeFullRow ? updateCellValueAndFullRow(childRow, cellInfo, false) : updateCellValue(childRow, cellInfo);
            propagateDeriveChild(childRow, cellInfo, shouldChangeFullRow);
        } else {
            loopSubRowsBasic(childRow, searchedRowId, cellInfo, shouldChangeFullRow);
        }
    }
}


export function propagateDeriveChild(currentRow, cellInfo, shouldChangeFullRow) {
    for (let i = 0; i < currentRow.subRows.length; i++) {
        const childRow = currentRow.subRows[i];

        const currentTable = childRow.permissions.find(item => item.tableId === cellInfo.tableId);
        if (currentTable.access[0].isDerived === false) { continue; }

        cellInfo.isDerived = true;
        shouldChangeFullRow ? updateCellValueAndFullRow(childRow, { ...cellInfo }, true) : updateCellValue(childRow, { ...cellInfo });

        if (currentRow.subRows.length === 0) { continue; }
        propagateDeriveChild(childRow, cellInfo, shouldChangeFullRow);
    }
}

export function updateCellValue(currentRow, cellInfo) {
    for (let j = 0; j < currentRow.permissions.length; j++) {
        const roleObject = currentRow.permissions[j];

        if (roleObject.tableId !== cellInfo.tableId) { continue; }

        for (let k = 0; k < roleObject.access.length; k++) {
            const cellObject = roleObject.access[k];

            if (cellObject.accessType !== cellInfo.accessType) { continue; }
            currentRow.permissions[j].access[k].hasPermission = cellInfo.hasPermission;
            currentRow.permissions[j].access[k].isDerived = cellInfo.isDerived;
            return;
        }
    }
}

export function updateCellValueAndFullRow(currentRow, cellInfo, isRowDerived) {
    for (let j = 0; j < currentRow.permissions.length; j++) {
        const roleObject = currentRow.permissions[j];

        if (roleObject.tableId !== cellInfo.tableId) { continue; }

        for (let k = 0; k < roleObject.access.length; k++) {
            const cellObject = roleObject.access[k];

            if (cellObject.accessType === cellInfo.accessType && roleObject.tableId === cellInfo.tableId) {
                currentRow.permissions[j].access[k].hasPermission = cellInfo.hasPermission;
                currentRow.permissions[j].access[k].isDerived = cellInfo.isDerived;
            } else {
                currentRow.permissions[j].access[k].hasPermission = false;
                currentRow.permissions[j].access[k].isDerived = isRowDerived;
            }
        }
    }
}

// TODO
export function getColumnsIdsCollection(currentRowOfCellsCollection) {
    const idsCollection = [];
    for (let i = 0; i < currentRowOfCellsCollection.length; i += GlobalVars.ACCESS_TYPES_COLLECTION.length) {
        idsCollection.push(currentRowOfCellsCollection[i].column.parent.tableId);
    }
    return idsCollection;
}

export function getColumnsIdsMapper(currentRowOfCellsCollection) {
    const idsMapper = {};
    for (let i = 0; i < currentRowOfCellsCollection.length; i += GlobalVars.ACCESS_TYPES_COLLECTION.length) {

        idsMapper[currentRowOfCellsCollection[i].column.parent.tableId] = true;
    }
    return idsMapper;
}
export function childrenDerivedChecked(currObject, rowsDerivedStatusCollection) {
    if (rowsDerivedStatusCollection.length === 0) { return true; }

    let derivedStatus = true;
    const currentObjectLen = currObject.uri.split('/').length;
    for (let i = 0; i < rowsDerivedStatusCollection.length; i++) {
        const item = rowsDerivedStatusCollection[i];
        const itemLen = rowsDerivedStatusCollection[i][0].split('/').length;

        if (!item[0].includes(currObject.uri)) { continue; }
        if (itemLen - 1 !== currentObjectLen) { continue; }

        if (item[1] === false) {
            derivedStatus = false;
            break;
        }
        derivedStatus = true
    }
    return derivedStatus;
}

export function recursivelyHideColumns(rowsCollection, columnsToDeleteMapper) {
    return rowsCollection.reduce((prev, curr) => {

        if (curr.subRows && curr.subRows.length > 0) {
            recursivelyHideColumns(curr.subRows, columnsToDeleteMapper)
        }

        const newObject = removeColumnsFromPermissions(curr, columnsToDeleteMapper)

        prev.push(newObject);
        return prev;
    }, [])
}

export function removeColumnsFromPermissions(currentObject, columnsToDeleteMapper) {

    const modifiedPermissions = currentObject.permissions.map(roleObject => {

        const filteredAccessCollection = roleObject.access.filter(cellObject => {
            if (!columnsToDeleteMapper.hasOwnProperty(cellObject.accessType)) {
                return true
            }
            return false
        })
        return { ...roleObject, access: filteredAccessCollection }
    })

    return { ...currentObject, permissions: modifiedPermissions };
}

export function mapIdWithChecked(flattenedEntityTypeCollection) {
    const resultObject = {}
    flattenedEntityTypeCollection.forEach(item => {
        resultObject[item.original.id] = item.isChecked
    })
    return resultObject;
}

export function changeCellValueToNextWithoutDerived(currentCell) {
    const updatedCell = { ...currentCell }

    if (updatedCell.isDefault) {
        updatedCell.isDefault = false;
        return { ...updatedCell, isDerived: false, hasPermission: false }
    }

    return { ...updatedCell, isDerived: false, hasPermission: !currentCell.hasPermission };
}

export function changeCellValueToSpecific(currentCell, cellValue) {
    const updatedCell = { ...currentCell }

    updatedCell.isDerived && (updatedCell.isDerived = false)
    updatedCell.hasPermission = cellValue;

    return updatedCell;
}

export function checkIfFullRowIsDerived(currObject) {
    return currObject.permissions.every(item => item.access[0].isDerived === true);
}
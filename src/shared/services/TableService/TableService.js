import { CellsService } from "../CellsService/CellsService";
import {
    changeCellValueToNextWithoutDerived, changeCellValueToSpecific, childrenDerivedChecked,
    mapIdWithChecked, recursivelyHideColumns, checkIfFullRowIsDerived
} from "./utils";


Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter(key => predicate(obj[key]))
        .reduce((res, key) => (res[key] = obj[key], res), {});


const TableService = {}
let rowsDerivedStatusCollection = []; // Tuple - [ [uri, isDerivedBool], [...] ]

TableService.editCell = function (cell, originalDataCollection, shouldChangeFullRow, specificValue = null, isDerived = null) {
    const currentCell = cell.value;
    let newCell;
    if (typeof specificValue === 'boolean') {
        newCell = changeCellValueToSpecific(currentCell, specificValue);
        typeof isDerived === 'boolean' && (newCell = { ...newCell, isDerived })
    } else {
        newCell = changeCellValueToNextWithoutDerived(currentCell)
    }

    CellsService.updateCellsValues(
        originalDataCollection,
        cell.row.original.id,
        {
            hasPermission: newCell.hasPermission,
            isDerived: newCell.isDerived || false,
            accessType: cell.value.accessType,
            tableId: cell.column.parent.tableId
        },
        shouldChangeFullRow
    );
}

TableService.editMultiple = function (cellCollection, originalDataCollection, value) {
    cellCollection.forEach(cell => {
        this.editCell(cell, originalDataCollection, cell.value.isDerived, value);
        // this.denyAllDerivedAtTheSameTableRow(cell);
    })
}

TableService.filterParentRows = function (originalDataCollection, flattenedEntityType) {
    const idCheckedObject = mapIdWithChecked(flattenedEntityType)
    const parentRow = flattenedEntityType[0];
    const originalParent = originalDataCollection.filter(item => item.id === parentRow.original.id);

    return recursiveReduce(originalParent, idCheckedObject);
}

TableService.denyAllDerivedAtTheSameTableRow = function (selectedCell) {
    selectedCell.row.original.permissions.forEach((roleItem, roleIndex) => {

        roleItem.access.forEach((accessObject, accessIndex) => {

            const isCellValidForUpdate = accessObject.cellId !== selectedCell.value.cellId && accessObject.isDerived;
            if (isCellValidForUpdate) {
                let modifiedCell = changeCellValueToSpecific(accessObject, false);
                selectedCell.row.original.permissions[roleIndex].access[accessIndex] = { ...modifiedCell };
            }
        })
    })
}

TableService.hideDerivedRows = function (rowsCollection) {
    return recursivelyHideDerivedRows(rowsCollection);
}

TableService.showDerivedRows = function (originalCollection, viewCollection) {

    rowsDerivedStatusCollection = [];

    if (viewCollection.length === 0) {
        return originalCollection;
    }

    if (viewCollection.length === originalCollection.length) {
        return originalCollection;
    }

    return [originalCollection.find(item => item.uri === viewCollection[0].uri)];
}

TableService.hideFilteredColumns = function (viewCollection, columnsMapper) {
    const filtered = Object.filter(columnsMapper, item => item.isVisible === false);
    const res = recursivelyHideColumns(viewCollection, filtered);
    return res;
}


function recursiveReduce(originalParent, idCheckedObject) {

    return originalParent.reduce(function fr(prev, currObject) {
        const key = currObject.id

        if (currObject.subRows) {
            const subRows = currObject.subRows.reduce(fr, []);
            if (idCheckedObject[key] === true) {
                return prev.concat({ ...currObject, subRows: subRows });
            }
        }

        if (idCheckedObject[key]) {
            return prev.concat(currObject);
        }
        return prev;
    }, []);
}

function recursivelyHideDerivedRows(rowsCollection) {


    return rowsCollection.reduce((prev, curr) => {
        const currentObject = Object.assign({}, curr);

        if (curr.subRows && curr.subRows.length > 0) {
            currentObject.subRows = recursivelyHideDerivedRows(curr.subRows)
        }

        if (!checkIfRowIsDerived(curr, rowsDerivedStatusCollection)) {
            prev.push(currentObject)
        }
        return prev;
    }, []);
}

function checkIfRowIsDerived(currObject, rowsDerivedStatusCollection) {
    const isFullRowDerived = checkIfFullRowIsDerived(currObject);

    const childrenCheck = childrenDerivedChecked(currObject, rowsDerivedStatusCollection);
    const result = isFullRowDerived && childrenCheck;

    const currentObjectLength = currObject.uri.split('/').length;
    const isParent = currentObjectLength === 2;

    if (isParent) {
        rowsDerivedStatusCollection = [];
    }

    rowsDerivedStatusCollection.push([currObject.uri, result]);
    return result;
}

export default TableService
import { GlobalVars } from "../../../utils/globals";
import {
    getColumnsIdsMapper, updateParentCellValues,
    loopSubRows, loopSubRowsBasic, propagateDeriveChild,
    propagateToDerivedChildren, updateCellValue, updateCellValueAndFullRow
} from "./utils";

export const CellsService = {}

// derive mode
CellsService.getSelectedCellsPerRow = function (selectedCellsCollection, visibleRolesIdsCollection) {
    const RIGHTS_COUNT = GlobalVars.ACCESS_TYPES_COLLECTION.length;
    const cellsPerRow = visibleRolesIdsCollection.length * RIGHTS_COUNT;

    return selectedCellsCollection.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / cellsPerRow)

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])
}

CellsService.makeRowsDerived = function (originalPermissionsCollection, currentRowOfCellsCollection) {
    const searchedRowId = currentRowOfCellsCollection[0].row.original.id;
    const searchedTablesIdsMapper = getColumnsIdsMapper(currentRowOfCellsCollection);

    for (let i = 0; i < originalPermissionsCollection.length; i++) {
        const currentRow = originalPermissionsCollection[i];
        if (!searchedRowId.startsWith(currentRow.id)) { continue; }

        if (currentRow.id === searchedRowId) {
            updateParentCellValues(currentRow, searchedTablesIdsMapper);
            propagateToDerivedChildren(currentRow, searchedTablesIdsMapper);
        } else {
            loopSubRows(currentRow, searchedRowId, searchedTablesIdsMapper, null);
        }
    }
}

// basic mode
CellsService.updateCellsValues = function (originalPermissionsCollection, currentRowId, cellInfo, shouldChangeFullRow) {
    for (let i = 0; i < originalPermissionsCollection.length; i++) {
        const currentRow = originalPermissionsCollection[i];
        if (!currentRowId.startsWith(currentRow.id)) { continue; }
        if (currentRowId === currentRow.id) {
            
            shouldChangeFullRow ? updateCellValueAndFullRow(currentRow, cellInfo, false) : updateCellValue(currentRow, cellInfo)
            propagateDeriveChild(currentRow, cellInfo, shouldChangeFullRow);
        } else {
            loopSubRowsBasic(currentRow, currentRowId, cellInfo, shouldChangeFullRow);
        }
    }
}
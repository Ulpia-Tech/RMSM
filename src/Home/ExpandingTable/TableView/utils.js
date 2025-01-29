import { GlobalVars } from "../../../utils/globals";

export const findSelectedCellsByColumn = (rows, columnId, alreadySelectedCollection) => {
    const extractedCellsCollection = [];
    const unSelectCollection = [];

    rows.forEach(rowObject => {
        const currentCell = rowObject.cells.find(({ column: { id } }) => id === columnId);
        if (!currentCell) { return; }

        const isSelected = checkIfAlreadySelected(currentCell, alreadySelectedCollection);

        if (alreadySelectedCollection.length === 0) {
            extractedCellsCollection.push(currentCell);
        } else if (!isSelected) {
            extractedCellsCollection.push(currentCell);
        } else if (isSelected) {
            unSelectCollection.push(currentCell);
        }
    })

    const shouldUnselect = extractedCellsCollection.length === 0 && unSelectCollection.length > 0;
    if (shouldUnselect) {
        return {
            operation: GlobalVars.SELECT_TYPES.UNSELECT,
            collection: unSelectCollection
        }
    }

    const shouldSelect = extractedCellsCollection.length > 0;
    if (shouldSelect) {
        return {
            operation: GlobalVars.SELECT_TYPES.SELECT,
            collection: extractedCellsCollection
        }
    }
}

export const findSelectedCellsByRow = (rows, alreadySelectedCollection) => {
    const extractedCellsCollection = [];
    const unSelectCollection = [];
    
    if(alreadySelectedCollection.length === 0) { 
        return { 
            operation: GlobalVars.SELECT_TYPES.SELECT,
            collection: rows
        }
    }

    for (let i = 0; i < rows.length; i++) {

        const isSelected = checkIfAlreadySelected(rows[i], alreadySelectedCollection);
        
        if(!isSelected) { 
            extractedCellsCollection.push(rows[i]);
        } else { 
            unSelectCollection.push(rows[i]);
        }
    }

    const shouldUnselect = extractedCellsCollection.length === 0 && unSelectCollection.length > 0;
        if(shouldUnselect) { 
            return { 
                operation: GlobalVars.SELECT_TYPES.UNSELECT,
                collection: unSelectCollection
            }
        }
        return { 
            operation: GlobalVars.SELECT_TYPES.SELECT,
            collection: extractedCellsCollection
        } 
}

export const initSelectableColumns = (allColumns) => {

    const columnsMapper = {};

    for (let i = 1; i < allColumns.length; i++) {
        const column = allColumns[i];
        const columnName = column.Header.props.children;

        if (!columnsMapper.hasOwnProperty(columnName)) {
            columnsMapper[columnName] ={ columnsIds: [column.id], isVisible: true };
            continue;
        }
        columnsMapper[columnName] = { columnsIds: [...columnsMapper[columnName].columnsIds, column.id], isVisible: true };
    }
    return columnsMapper
}

function checkIfAlreadySelected(currentCell, alreadySelectedCollection) {
    return !!alreadySelectedCollection.find(item => item.value.cellId === currentCell.value.cellId);
}

export const accessTypesMapper = { 
    CREATE: 'Create',
    READ: 'Read',
    MERGE: 'Merge',
    UNMERGE: 'Unmerge',
    UPDATE: 'Update',
    DELETE: 'Delete',
    INITIATE_CHANGE_REQUEST: 'Initiate_DCR',
    ACCEPT_CHANGE_REQUEST: 'Accept_DCR',
}
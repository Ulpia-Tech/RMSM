import { CellsService } from "../../shared/services/CellsService/CellsService";
import TableService from "../../shared/services/TableService/TableService";
import { AdapterV2 } from "../../utils/adapterV2";

export const PermissionsStore = {}

PermissionsStore.action_types = {
    INITIAL_PROCESS: 'initial-process',
    MODIFY_CELL: 'modify-cell',
    MODIFY_CELL_WITH_SPECIFIC_VALUE: 'modifiy-cell-with-specific-value',
    DENY_MULTIPLE_CELLS: 'deny-multiple-cells',
    GRANT_MULTIPLE_CELLS: 'grant-multiple-cells',
    FILTER_ROWS: 'filter-rows',
    HIDE_DERIVED_ROWS: 'hide-derived-rows',
    SHOW_DERIVED_ROWS: 'show-derived-rows',
    RESET_FILTERS_ROWS: 'reset-filters-rows',
    HIDE_SELECTED_COLUMNS: 'hide-selected-columns',
    MAKE_ROWS_DERIVED: 'make-rows-derived'
}

// payload: { cell / cell, value }
// payload: { collection, flatRows }
// payload: { flatEnityType }

PermissionsStore.reducer = (state, action) => {

    switch (action.type) {

        case PermissionsStore.action_types.INITIAL_PROCESS:
            let processedFile = null;

            if(action.payload.mergedFile) {
                processedFile = AdapterV2.process(action.payload.mergedFile);
            }
            return { originalPermissionsCollection: [...processedFile], viewPermissionsCollection: [...processedFile] };

        case PermissionsStore.action_types.MODIFY_CELL:
            TableService.editCell(action.payload.cell, state.originalPermissionsCollection, false);
            return { originalPermissionsCollection: [...state.originalPermissionsCollection], viewPermissionsCollection: [...state.viewPermissionsCollection] }

        case PermissionsStore.action_types.MODIFY_CELL_WITH_SPECIFIC_VALUE:
            TableService.editCell(action.payload.cell, state.originalPermissionsCollection, action.payload.shouldChangeFullRow, action.payload.value);
            return { originalPermissionsCollection: [...state.originalPermissionsCollection], viewPermissionsCollection: [...state.viewPermissionsCollection] }

        case PermissionsStore.action_types.DENY_MULTIPLE_CELLS:
            TableService.editMultiple(action.payload.collection, state.originalPermissionsCollection, false);
            return { originalPermissionsCollection: [...state.originalPermissionsCollection], viewPermissionsCollection: [...state.viewPermissionsCollection] }

        case PermissionsStore.action_types.GRANT_MULTIPLE_CELLS:
            TableService.editMultiple(action.payload.collection, state.originalPermissionsCollection, true);
            return { originalPermissionsCollection: [...state.originalPermissionsCollection], viewPermissionsCollection: [...state.viewPermissionsCollection] }

        case PermissionsStore.action_types.FILTER_ROWS:
            const filtered = TableService.filterParentRows(state.originalPermissionsCollection, action.payload.flatEntityType);
            return { originalPermissionsCollection: [...state.originalPermissionsCollection], viewPermissionsCollection: filtered }

        case PermissionsStore.action_types.RESET_FILTERS_ROWS:
            return { originalPermissionsCollection: [...state.originalPermissionsCollection], viewPermissionsCollection: [...state.originalPermissionsCollection] }

        case PermissionsStore.action_types.HIDE_DERIVED_ROWS:
            const filteredCollection = TableService.hideDerivedRows(state.viewPermissionsCollection);
            return { originalPermissionsCollection: [...state.originalPermissionsCollection], viewPermissionsCollection: filteredCollection }

        case PermissionsStore.action_types.SHOW_DERIVED_ROWS:
            const viewDataModifiedCollection = TableService.showDerivedRows(state.originalPermissionsCollection, state.viewPermissionsCollection);
            return { originalPermissionsCollection: [...state.originalPermissionsCollection], viewPermissionsCollection: viewDataModifiedCollection }

        case PermissionsStore.action_types.HIDE_SELECTED_COLUMNS:
            const columnsMapper = action.payload.columnsMapper;
            const modifiedViewCollection = TableService.hideFilteredColumns(state.viewPermissionsCollection, columnsMapper);
            return { originalPermissionsCollection: [...state.originalPermissionsCollection], viewPermissionsCollection: modifiedViewCollection }

        case PermissionsStore.action_types.MAKE_ROWS_DERIVED:
            CellsService.makeRowsDerived(state.viewPermissionsCollection, action.payload.collection);
            return { originalPermissionsCollection: [...state.originalPermissionsCollection], viewPermissionsCollection: [...state.viewPermissionsCollection] }

        default:
            return
    }
}
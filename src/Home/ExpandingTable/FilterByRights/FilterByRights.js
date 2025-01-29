import { Link } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { Box } from '@mui/system';
import { useActiveFiltersCounter } from '../../../Context/ActiveFiltersCounterContext/ActiveFiltersCounterContextProvider';
import { useReactTableLibContext } from "../../../Context/ReactTableLibContext/ReactTableLibContextProvider";
import { useRolesCollection } from '../../../Context/RolesContext/RolesContextProvider';
import { useSelectedCells } from '../../../Context/SelectedCellsContext/SelectedCellsContextProvider';
import { SelectedCellsStore } from '../../../Context/SelectedCellsContext/SelectedCellsStore';
import { GlobalVars } from '../../../utils/globals';

const FilterByRights = () => {

    const {
        columnsMapper: columnsMapperState, setColumnsMapper: setColumnsMapperState,
        allColumns: allColumnsState,
        derivedMode: derivedModeState
    } = useReactTableLibContext();

    const { activeFiltersCollection: activeFiltersCollectionState, setActiveFiltersCollection: setActiveFiltersCollectionState } = useActiveFiltersCounter();

    const {
        state: rolesState,
    } = useRolesCollection();

    const { dispatch: selectedCellsDispatcher } = useSelectedCells();

    const handleChange = (event, eventItem) => {
        if (!eventItem.props.value) { return; }

        selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} })

        const columnName = eventItem.props.value;
        hideOrShowColumn(columnName);

        const updatedColumnsMapper = { ...columnsMapperState };
        const newVisibleValue = !updatedColumnsMapper[columnName].isVisible;

        updatedColumnsMapper[columnName] = {
            ...updatedColumnsMapper[columnName],
            isVisible: newVisibleValue
        }
        setColumnsMapperState(updatedColumnsMapper);

        const shouldAddToActiveFilters = !newVisibleValue && !isFilterUsed();
        const shouldRemoveFromActiveFilters = newVisibleValue && shouldRemoveFilter(updatedColumnsMapper[columnName], columnName);

        if (shouldAddToActiveFilters) {
            setActiveFiltersCollectionState([...activeFiltersCollectionState, { type: GlobalVars.FILTER_TYPES.RIGHT }]);
        } else if (shouldRemoveFromActiveFilters) {
            setActiveFiltersCollectionState(activeFiltersCollectionState.filter(item => item.type !== GlobalVars.FILTER_TYPES.RIGHT));
        }
    }

    const hideOrShowColumn = (columnName) => {
        for (let i = 1; i < allColumnsState.length; i++) {
            const columnObject = allColumnsState[i];

            if (columnObject.Header.props.children !== columnName) { continue; }
            columnObject.toggleHidden();
        }
    }

    const hideAll = () => {
        if (isHideReduntant()) { return; }
        selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} })

        const columnsMapperStateCopy = { ...columnsMapperState }
        for (const [key, value] of Object.entries(columnsMapperState)) {
            columnsMapperStateCopy[key].isVisible = false;
        }

        for (let i = 1; i < allColumnsState.length; i++) {
            const columnObject = allColumnsState[i];

            if (rolesState.visibleRolesCollection.find(item => item.tableId === columnObject.parent.tableId)) { 
                columnObject.toggleHidden(true);
            }
        }

        setColumnsMapperState(columnsMapperStateCopy);
        allColumnsState[0].toggleHidden(false);
        setActiveFiltersCollectionState([...activeFiltersCollectionState, { type: GlobalVars.FILTER_TYPES.RIGHT }]);
    }

    const showAll = () => {
        if (isShowReduntant()) { return; }
        selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} })

        const columnsMapperStateCopy = { ...columnsMapperState }
        for (const [key, value] of Object.entries(columnsMapperState)) {
            columnsMapperStateCopy[key].isVisible = true;
        }

        for (let i = 1; i < allColumnsState.length; i++) {
            const columnObject = allColumnsState[i];

            if (rolesState.visibleRolesCollection.find(item => item.tableId === columnObject.parent.tableId)) {
                columnObject.toggleHidden(false);
            }
        }

        setColumnsMapperState(columnsMapperStateCopy);
        setActiveFiltersCollectionState(activeFiltersCollectionState.filter(item => item.type !== GlobalVars.FILTER_TYPES.RIGHT));
    }

    const isFilterUsed = () => {
        for (const [key, { columnsIds, isVisible }] of Object.entries(columnsMapperState)) {

            if (!isVisible) {
                return true
            }
        }
        return false
    }

    const shouldRemoveFilter = (latestModifiedItem, columnName) => {
        for (const [key, { columnsIds, isVisible }] of Object.entries(columnsMapperState)) {

            if (!isVisible && key !== columnName) {
                return false;
            }
            if (!isVisible && !latestModifiedItem.isVisible) {
                return false;
            }
        }
        return true
    }

    const isLast = () => {
        let count = 0;
        Object.entries(columnsMapperState).some(([key, value]) => {
            if (value.isVisible) { count++ }
        })

        const isLast = count === 1 ? true : false;
        return isLast;
    }

    const isHideReduntant = () => {
        let areAllHidden = true;
        Object.entries(columnsMapperState).some(([key, value]) => {
            if (value.isVisible) {
                areAllHidden = false;
            }
        })
        return areAllHidden;
    }

    const isShowReduntant = () => {
        let areAllVisible = true;
        Object.entries(columnsMapperState).some(([key, value]) => {
            if (!value.isVisible) {
                areAllVisible = false;
            }
        })
        return areAllVisible
    }

    return (
        <>
            <FormControl sx={{ m: 1, width: 375 }}>
                <InputLabel id="demo-multiple-checkbox-label">Filter rights</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    data-testid="filter-by-right-select"
                    multiple
                    value={(Object.entries(columnsMapperState))
                        .filter(([columnName, value]) => value.isVisible)
                        .map(([columnName, value]) => columnName)}

                    onChange={handleChange}
                    disabled={derivedModeState}
                    input={<OutlinedInput label="Filter rights" />}
                    renderValue={(selected) => {
                        const areAllCheckboxesSelected = selected.length === GlobalVars.ACCESS_TYPES_COLLECTION.length;
                        if (areAllCheckboxesSelected) {
                            return <span>All selected</span>
                        }
                        return selected.join(', ');
                    }}>
                    <Box sx={{ borderBottom: '1px solid #C8C8C8', paddingTop: 1, paddingBottom: 1.5 }}>
                        <Box marginLeft={3.5}>
                            <Link
                                onClick={showAll}
                                component="button"
                                data-testid="filter-by-right-select-all"
                                sx={{ paddingRight: 2, borderRight: '1px solid #C8C8C8' }}
                                variant="body1">Select all</Link>

                            <Link
                                onClick={hideAll}
                                component="button"
                                data-testid="filter-by-right-clear"
                                sx={{ paddingLeft: 2, }}
                                variant="body1">Deselect</Link>

                        </Box>
                    </Box>
                    {Object.entries(columnsMapperState).map(([columnName, value]) => {
                        return (
                            <MenuItem key={columnName} value={columnName}>
                                <Checkbox disableRipple checked={value.isVisible} data-testid={columnName} />
                                <ListItemText primary={columnName} />
                            </MenuItem>
                        )
                    })}

                </Select>
            </FormControl>

        </>
    )
}

export default FilterByRights
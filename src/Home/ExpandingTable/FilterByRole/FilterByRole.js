import { Box, Link } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { useActiveFiltersCounter } from '../../../Context/ActiveFiltersCounterContext/ActiveFiltersCounterContextProvider';
import { useRolesCollection } from "../../../Context/RolesContext/RolesContextProvider";
import { RoleStore } from '../../../Context/RolesContext/RoleStore';
import { useSelectedCells } from '../../../Context/SelectedCellsContext/SelectedCellsContextProvider';
import { SelectedCellsStore } from '../../../Context/SelectedCellsContext/SelectedCellsStore';
import { GlobalVars } from '../../../utils/globals';

const FilterByRole = () => {
    const { dispatch: selectedCellsDispatcher } = useSelectedCells();

    const { 
        state: rolesState,
        dispatch: rolesDispatcher,
    } = useRolesCollection();

    const { activeFiltersCollection: activeFiltersCollectionState, setActiveFiltersCollection: setActiveFiltersCollectionState } = useActiveFiltersCounter();
    
    const handleChange = (event, { props: { data: roleObject } }) => {

        selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} })

        const doesExists = checkIfChecked(roleObject.tableId);

        if (doesExists) {
            rolesDispatcher({ type: RoleStore.action_types.HIDE_ROLE, payload: { roleObject } });

            const shouldAddFilter = rolesState.allRolesCollection.length === rolesState.visibleRolesCollection.length;
            if(!shouldAddFilter) { return; }

            setActiveFiltersCollectionState([...activeFiltersCollectionState, { type: GlobalVars.FILTER_TYPES.ROLE } ]);

        } else {
            rolesDispatcher({ type: RoleStore.action_types.SHOW_ROLE, payload: { roleObject } });

            const shouldRemoveFilter = rolesState.allRolesCollection.length - 1 === rolesState.visibleRolesCollection.length;
            if(!shouldRemoveFilter) { return; }

            setActiveFiltersCollectionState(activeFiltersCollectionState.filter(item => item.type !== GlobalVars.FILTER_TYPES.ROLE));
        }
    }


    const checkIfChecked = (id) => {
        return rolesState.visibleRolesCollection.some(item => item.tableId === id);
    }

    const showAll = () => {
        selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} })
        rolesDispatcher({ type: RoleStore.action_types.RESET_HIDDEN_ROLES, payload: { } });
        setActiveFiltersCollectionState(activeFiltersCollectionState.filter(item => item.type !== GlobalVars.FILTER_TYPES.ROLE));
    }
    
    const hideAll = () => {
        selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} })

        rolesDispatcher({ type: RoleStore.action_types.HIDE_ALL, payload: { } });

        const shouldAddFilter = rolesState.allRolesCollection.length === rolesState.visibleRolesCollection.length;
        if(!shouldAddFilter) { return; }

        setActiveFiltersCollectionState([...activeFiltersCollectionState, { type: GlobalVars.FILTER_TYPES.ROLE } ]);
    }
    
    return (
        <div>
            <FormControl sx={{ m: 1, width: 375 }}>
                <InputLabel id="demo-multiple-checkbox-label">Filter roles</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    data-testid="filter-by-role-select"
                    multiple
                    value={rolesState.visibleRolesCollection.map(item => item.displayName)}
                    onChange={handleChange}
                    input={<OutlinedInput label="Filter roles" />}
                    renderValue={(selected) =>  {
                        const areAllCheckboxesSelected = selected.length === rolesState.allRolesCollection.length;
                        if(areAllCheckboxesSelected) { 
                            return <span>All selected</span>
                        }
                        return selected.join(', ');
                    }}
                >
                    <Box sx={{ borderBottom: '1px solid #C8C8C8', paddingTop: 1, paddingBottom: 1.5 }}>
                        <Box marginLeft={3.5}>
                            <Link
                                onClick={showAll}
                                component="button"
                                data-testid="filter-by-role-select-all"
                                sx={{ paddingRight: 2, borderRight: '1px solid #C8C8C8' }}
                                variant="body1">Select all</Link>

                            <Link
                                onClick={hideAll}
                                component="button"
                                data-testid="filter-by-role-clear"
                                sx={{ paddingLeft: 2, }}
                                variant="body1">Deselect</Link>

                        </Box>
                    </Box>
                    {rolesState.allRolesCollection.map(roleObject => {
                        const isChecked = checkIfChecked(roleObject.tableId);
                        return (
                            <MenuItem key={roleObject.tableId} value={roleObject.displayName}
                                roleobject={roleObject} data={roleObject} data-testid={roleObject.displayName}>
                                <Checkbox disableRipple checked={isChecked}/>
                                <ListItemText primary={roleObject.displayName} />
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    );
}

export default FilterByRole
import { Button, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useActiveFiltersCounter } from "../../../Context/ActiveFiltersCounterContext/ActiveFiltersCounterContextProvider";
import { usePermissionsCollection } from "../../../Context/PermissionsContext/PermissionsContextProvider";
import { PermissionsStore } from "../../../Context/PermissionsContext/PermissionStore";
import { useReactTableLibContext } from "../../../Context/ReactTableLibContext/ReactTableLibContextProvider";
import { useSelectedCells } from "../../../Context/SelectedCellsContext/SelectedCellsContextProvider";
import { SelectedCellsStore } from "../../../Context/SelectedCellsContext/SelectedCellsStore";
import { GlobalVars } from "../../../utils/globals";
import { isEmpty } from "../../../utils/helper";
import EntityTypeDropdown from "./EntityTypeDropdown/EntityTypeDropdown";
import SearchDropdown from "./SearchDropdown/SearchDropdown";
import { automaticallyCheckOrUncheckChilden, flat } from './utils';

const FilterAttribute = () => {

    const { visibleRowsCollection: visibleRowsCollectionState } = useReactTableLibContext();
    const { dispatch: permissionsCollectionDispatcher } = usePermissionsCollection();
    const { activeFiltersCollection: activeFiltersCollectionState, setActiveFiltersCollection: setActiveFiltersCollectionState } = useActiveFiltersCounter();
	const { dispatch: selectedCellsDispatcher } = useSelectedCells();
    

    const [activeEntityType, setActiveEntityType] = useState({});
    const [activeEntityTypeCollection, setActiveEntityTypeCollection] = useState([]);
    const theme = useTheme();

    useEffect(() => { 
        if(activeFiltersCollectionState.length === 0) { 
            setActiveEntityType({})
            setActiveEntityTypeCollection([]);
        }

    }, [activeFiltersCollectionState])

    const receiveActiveEntityType = (entityTypeUri) => {
        const activeEntityType = (visibleRowsCollectionState.filter(item => item.original.uri === entityTypeUri))[0] || {}
        const rowsFlattened = flat([activeEntityType]);
        const rowsFlattenedMutated = rowsFlattened.map(item => {
            return { ...item, isChecked: true }
        })
        setActiveEntityTypeCollection(rowsFlattenedMutated);
        setActiveEntityType(activeEntityType);
    }

    const handleCheckboxChange = (attribute, index) => {
        automaticallyCheckOrUncheckChilden(activeEntityTypeCollection, attribute);
        const newState = [...activeEntityTypeCollection]
        newState[index] = { ...attribute, isChecked: !attribute.isChecked };
        setActiveEntityTypeCollection(newState);
    }


    const handleApplyFilter = () => {
        permissionsCollectionDispatcher({ type: PermissionsStore.action_types.FILTER_ROWS, payload: { flatEntityType: activeEntityTypeCollection } })
        
        const doesFilterAttributeExists = activeFiltersCollectionState.some(item => item.type === GlobalVars.FILTER_TYPES.ATTRIBUTE);
        if(doesFilterAttributeExists) { return; }
        
        selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: []});
        setActiveFiltersCollectionState([...activeFiltersCollectionState, { type: GlobalVars.FILTER_TYPES.ATTRIBUTE }]);
    }

    return (
        <Box data-testid="filter-by-attribute" padding={'20px'} width={'410px'} sx={{ backgroundColor: theme.palette.fill.main }}>
            <EntityTypeDropdown
                onSelectActiveEntityType={receiveActiveEntityType} />

            {
                !isEmpty(activeEntityType)
                    ?
                    <>
                        <SearchDropdown entityTypeCollection={activeEntityTypeCollection} onHandleCheckboxChange={handleCheckboxChange} />
                    </>

                    :
                    <p style={{ margin: 15 }}></p>
            }
            <Button fullWidth
                sx={{ backgroundColor: 'white', width: '375px' }}
                disableElevation
                disableRipple
                disableFocusRipple
                disableTouchRipple
                disabled={isEmpty(activeEntityType) ? true : false}
                variant="outlined"
                data-testid="attributes-filter-apply"
                onClick={handleApplyFilter}>Apply</Button>

        </Box>
    )
}

export default FilterAttribute
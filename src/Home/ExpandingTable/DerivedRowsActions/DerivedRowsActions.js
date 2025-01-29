import { Popover, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useEffect, useState } from "react";
import { useActiveFiltersCounter } from "../../../Context/ActiveFiltersCounterContext/ActiveFiltersCounterContextProvider";
import { usePermissionsCollection } from "../../../Context/PermissionsContext/PermissionsContextProvider";
import { PermissionsStore } from "../../../Context/PermissionsContext/PermissionStore";
import { GlobalVars } from "../../../utils/globals";

const DerivedRowsActions = () => {
    const { dispatch: permissionsCollectionDispatcher } = usePermissionsCollection();
    const [isHideActive, setIsHideActive] = useState(true);
    const [popoverState, setPopoverState] = useState(null);

    const { activeFiltersCollection: activeFiltersCollectionState, setActiveFiltersCollection: setActiveFiltersCollectionState } = useActiveFiltersCounter();

    useEffect(() => {
        if (activeFiltersCollectionState.length === 0 && !isHideActive) {
            setIsHideActive(true);
        }

    }, [activeFiltersCollectionState])

    const handleToggle = () => {
        if (isHideActive) {
            permissionsCollectionDispatcher({ type: PermissionsStore.action_types.HIDE_DERIVED_ROWS, payload: {} });
            setActiveFiltersCollectionState([...activeFiltersCollectionState, { type: GlobalVars.FILTER_TYPES.DERIVE }]);

        } else {
            permissionsCollectionDispatcher({ type: PermissionsStore.action_types.SHOW_DERIVED_ROWS, payload: {} });
            setActiveFiltersCollectionState(activeFiltersCollectionState.filter(item => item.type !== GlobalVars.FILTER_TYPES.DERIVE));
        }

        setIsHideActive(!isHideActive);
    }

    const handlePopoverOpen = (event) => {
        setPopoverState(event.currentTarget);
    }

    const handlePopoverClose = () => {
        setPopoverState(null);
    }

    return (
        <div data-testid="filter-by-derived-rows" style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel control={
                <Switch checked={isHideActive} onChange={handleToggle} inputProps={{ 'aria-label': 'controlled' }} />

            } label={isHideActive ? 'Hide inherited rows' : 'Show inherited rows'} sx={{ marginLeft: 0.05 }} />
            <span
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <img src='/images/info-blue.svg' alt='info' style={{ paddingTop: 6, width: 22, cursor: 'pointer' }} />
            </span>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                open={Boolean(popoverState)}
                anchorEl={popoverState}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 2 }}>Inherited permissions derive the permissions from their immediate parent</Typography>
            </Popover>
        </div>
    )
}

export default DerivedRowsActions
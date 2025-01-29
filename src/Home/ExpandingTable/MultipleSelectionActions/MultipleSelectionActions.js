import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { usePermissionsCollection } from '../../../Context/PermissionsContext/PermissionsContextProvider';
import { PermissionsStore } from '../../../Context/PermissionsContext/PermissionStore';
import { useReactTableLibContext } from '../../../Context/ReactTableLibContext/ReactTableLibContextProvider';
import { useSelectedCells } from '../../../Context/SelectedCellsContext/SelectedCellsContextProvider';
import { SelectedCellsStore } from '../../../Context/SelectedCellsContext/SelectedCellsStore';
import MakeRowsDerived from './MakeRowsDerived/MakeRowsDerived';


const MultipleSelectionActions = () => {
    const { dispatch: permissionsCollectionDispatcher } = usePermissionsCollection();
    const {
        flatRows: flatRowsState,
        derivedMode: derivedModeState
    } = useReactTableLibContext();
    const { state: selectedCellsCollectionState, dispatch: selectedCellsDispatcher } = useSelectedCells();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleGrant = () => {
        if(selectedCellsCollectionState.length > 0) {
            permissionsCollectionDispatcher({ type: PermissionsStore.action_types.GRANT_MULTIPLE_CELLS, payload: { collection: selectedCellsCollectionState, flatRows: flatRowsState } });
        }
        close();
    }

    const handleDeny = () => {
        if(selectedCellsCollectionState.length > 0) {
            permissionsCollectionDispatcher({ type: PermissionsStore.action_types.DENY_MULTIPLE_CELLS, payload: { collection: selectedCellsCollectionState, flatRows: flatRowsState } });
        }
        close();
    }

    const close = () => {
        selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} })
        handleClose();
    }

    return (
        <>
            {
                derivedModeState ?
                    <>
                        <MakeRowsDerived />
                    </>
                    :
                    <>

                        <Button
                            id="demo-positioned-button"
                            aria-controls={open ? 'demo-positioned-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{ backgroundColor: '#77787C', color: '#ffff', '&:hover': { backgroundColor: '#49525C' } }}
                            endIcon={<ArrowDropDownIcon />}
                            variant='filled'
                            data-testid="edit-selected-cells"
                        >
                            Edit selected cells
                        </Button>
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorPosition={{ top: 448, left: 550 }}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',

                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <MenuItem onClick={handleGrant}>Grant to all selected</MenuItem>
                            <MenuItem onClick={handleDeny}>Deny to all selected</MenuItem>
                        </Menu>

                    </>
            }

        </>
    );
}

export default MultipleSelectionActions
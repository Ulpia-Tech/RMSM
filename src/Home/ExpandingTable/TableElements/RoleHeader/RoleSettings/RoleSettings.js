import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useRef, useState } from 'react';
import { useActiveFiltersCounter } from '../../../../../Context/ActiveFiltersCounterContext/ActiveFiltersCounterContextProvider';
import { usePermissionsCollection } from "../../../../../Context/PermissionsContext/PermissionsContextProvider";
import { useReactTableLibContext } from '../../../../../Context/ReactTableLibContext/ReactTableLibContextProvider';
import { useRolesCollection } from "../../../../../Context/RolesContext/RolesContextProvider";
import { RoleStore } from "../../../../../Context/RolesContext/RoleStore";
import { useValidationErrorsCollection } from '../../../../../Context/ValidationErrorsContext/ValidationErrorsContextProvider';
import DialogLayoutModified from "../../../../../shared/components/DialogLayoutModified/DialogLayoutModified";
import WarningContainer from "../../../../../shared/components/WarningContainer/WarningContainer";
import { RoleService } from "../../../../../shared/services/RoleService/RoleService";
import "./roleSettings.css";

const RoleSettings = ({ roleObject }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const editDialogRef = useRef();
    const deleteDialogRef = useRef();

    const [name, setName] = useState(roleObject.displayName);
    const {
        columnsMapper: columnsMapperState,
        setColumnsMapper: setColumnsMapperState,
        allColumns: allColumnsState
    } = useReactTableLibContext();

    const {
        dispatch: rolesDispatcher,
    } = useRolesCollection();

    const { activeFiltersCollection: activeFiltersCollectionState, setActiveFiltersCollection: setActiveFiltersCollectionState } = useActiveFiltersCounter();

    const { state: permissionsCollectionState } = usePermissionsCollection();

    const { validationErrorsCollection: validationErrorsCollectionState, setValidationErrorsCollection } = useValidationErrorsCollection();

    const warningText = <p>Are you sure you want to delete <strong>{roleObject.displayName}</strong> role?</p>;

    const handleEditNameChange = (event) => {
        setName(event.target.value);
    };

    const handleOpenActionSelect = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenEditDialog = () => {
        editDialogRef.current.handleOpen();
        setAnchorEl(null);
    }

    const handleOpenDeleteDialog = () => {
        deleteDialogRef.current.handleOpen();
        setAnchorEl(null);
    }

    const handleSaveEdit = () => {
        resetRightsFilters();
        RoleService.editRoleTable(permissionsCollectionState.originalPermissionsCollection, { tableId: roleObject.tableId, displayName: name });
        rolesDispatcher({ type: RoleStore.action_types.EDIT_ROLE, payload: { roleObject, newName: name } });

        handleCloseEdit();
    }

    const handleSaveDelete = () => {
        resetRightsFilters();
        removeErrorsForRole();
        RoleService.removeRoleTable(permissionsCollectionState.viewPermissionsCollection, roleObject.tableId);
        rolesDispatcher({ type: RoleStore.action_types.DELETE_ROLE, payload: { roleObject } });

        handleCloseDelete();
    }

    const handleCloseEdit = () => {
        editDialogRef.current.handleClose();
    }

    const handleCloseDelete = () => {
        deleteDialogRef.current.handleClose();
    }

    const resetRightsFilters = () => {
        const modifiedColumnMapper = { ...columnsMapperState };
        for (let i = 1; i < allColumnsState.length; i++) {
            const columnObject = allColumnsState[i];
            const colName = columnObject.Header.props.children;

            if (!columnsMapperState[colName].isVisible) {
                columnObject.toggleHidden();
            }

            if (!modifiedColumnMapper[colName].isVisible) {
                modifiedColumnMapper[colName].isVisible = true
            }
        }
        setColumnsMapperState(modifiedColumnMapper);
        setActiveFiltersCollectionState(activeFiltersCollectionState.filter(item => item.type !== 'right'));
    }

    const removeErrorsForRole = () => {
        const newErrors = validationErrorsCollectionState.filter(error => {
            return error.tableId !== roleObject.tableId;
        });

        setValidationErrorsCollection(newErrors);
    }

    return (
        <>
            <img data-testid="role-settings-icon" height={20} style={{ cursor: 'pointer' }} src='/images/settings-blue.svg' alt='settings-blue' onClick={handleOpenActionSelect} />
            <Menu
                disableAutoFocusItem
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                className={'settings-menu'}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',

                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem data-testid="role-rename" onClick={handleOpenEditDialog}>
                    <img className="settings-icon" height={16} src='/images/placeholder-gray.svg' alt='placeholder' />
                    Rename
                </MenuItem>
                <MenuItem data-testid="role-delete" onClick={handleOpenDeleteDialog}>
                    <img className="settings-icon" height={16} src='/images/trashbin-gray.svg' alt='trashbin' />
                    Delete
                </MenuItem>
            </Menu>
            <DialogLayoutModified ref={editDialogRef} headingText='Edit Role'
                mainActionText={'Save'} secondaryActionText={'Cancel'}
                handleSubmitMainAction={handleSaveEdit}
                handleSubmitSecondaryAction={handleCloseEdit}
            >
                <p style={{ fontWeight: 500, fontSize: '16px', margin: '20px 0 10px 0' }}>Role rename</p>
                <TextField
                    id="outlined-name"
                    variant="filled"
                    fullWidth
                    value={name}
                    onChange={handleEditNameChange}
                    sx={{ marginTop: 0 }} />

            </DialogLayoutModified>
            <DialogLayoutModified ref={deleteDialogRef} headingText='Confirmation'
                mainActionText={'Delete'} secondaryActionText={'Cancel'}
                handleSubmitMainAction={handleSaveDelete}
                handleSubmitSecondaryAction={handleCloseDelete}
            >
                <WarningContainer description={warningText} imgPath={'/images/trashbin-red.svg'} />
            </DialogLayoutModified>
        </>
    );
}

export default RoleSettings
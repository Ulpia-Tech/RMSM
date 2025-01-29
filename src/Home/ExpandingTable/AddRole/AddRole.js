import { Box, Button, Link, TextField, useTheme } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { useRef, useState } from "react";
import { useActiveFiltersCounter } from "../../../Context/ActiveFiltersCounterContext/ActiveFiltersCounterContextProvider";
import { usePermissionsCollection } from "../../../Context/PermissionsContext/PermissionsContextProvider";
import { useReactTableLibContext } from "../../../Context/ReactTableLibContext/ReactTableLibContextProvider";
import { useRolesCollection } from "../../../Context/RolesContext/RolesContextProvider";
import { RoleStore } from "../../../Context/RolesContext/RoleStore";
import { useTenantRolesCollection } from "../../../Context/TenantRolesContext/TenantRolesContextProvider";
import DialogLayoutModified from '../../../shared/components/DialogLayoutModified/DialogLayoutModified';
import { RoleService } from "../../../shared/services/RoleService/RoleService";
import { IdGenerator } from "../../../utils/process-data";
import documentation from "../../../utils/MSM_Documentation.pdf";


function createNewRole(displayName) {
    return { displayName, tableId: IdGenerator() }
}

const getPlusIconSrc = () => {
    return '/images/add-blue.svg';
}

const AddRole = () => {
    const theme = useTheme();
    const addRoleDialogRef = useRef();

    const [name, setName] = useState('');
    const [isNameValid, setIsNameValid] = useState(false);

    const [isSwitchChecked, setIsSwitchChecked] = useState(false);
    const [selectedRole, setSelectedRole] = useState({ name: '', tableId: null });

    const [plusIconSrc, setPlusIconSrc] = useState(getPlusIconSrc());

    const { state: permissionsCollectionState } = usePermissionsCollection();
    const {
        columnsMapper: columnsMapperState,
        setColumnsMapper: setColumnsMapperState,
        allColumns: allColumnsState
    } = useReactTableLibContext();

    const { activeFiltersCollection: activeFiltersCollectionState, setActiveFiltersCollection: setActiveFiltersCollectionState } = useActiveFiltersCounter();

    const {
        state: rolesState,
        dispatch: rolesDispatcher,
    } = useRolesCollection();

    const { allTenantRolesCollection } = useTenantRolesCollection();
    const rolesForSelect = allTenantRolesCollection.filter(role => {
        return !rolesState.allRolesCollection.some(roleObject => roleObject.displayName === role);
    });

    const handleChange = (event) => {
        setName(event.target.value);
        if (event.target.value.length > 2) {
            setIsNameValid(true);
            return
        }
        setIsNameValid(false);
    };

    const handleOpenDialog = () => {
        addRoleDialogRef.current.handleOpen();
    }

    const handleRoleSelectChange = (event, { props }) => {
        const tableId = props['data-itemid'];
        setSelectedRole({ name: event.target.value, tableId });
    }

    const checkIfRoleNameIsValid = () => {
        return isNameValid;
    }

    const handleSave = () => {
        if (name.length < 3) { return; }

        const roleObject = createNewRole(name);
        rolesDispatcher({ type: RoleStore.action_types.ADD_ROLE, payload: { roleObject } });
        // rolesCollectionDispatcher({ type: RoleStore.action_types.ADD_ROLE, payload: { roleObject } });

        if (selectedRole.name.length > 0) {
            RoleService.addRoleTableBasedOnOther(permissionsCollectionState.originalPermissionsCollection, roleObject, selectedRole.tableId);
        } else {
            RoleService.addRoleTable(permissionsCollectionState.originalPermissionsCollection, roleObject);
        }
        handleClose()
    }

    const handleClose = () => {
        resetRightsFilters();
        setName('');
        setIsSwitchChecked(false);
        setSelectedRole({ name: '', id: null });
        addRoleDialogRef.current.handleClose();
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


    const plusImg = <img src={plusIconSrc} style={{ width: '15px', '&:hover': { color: 'white' } }} alt='plus' />;

    return (
        <Box position={'relative'}>
            <Button startIcon={plusImg}
                variant="outlined"
                sx={{ width: '100%', marginBottom: 2 }}
                onMouseEnter={() => { setPlusIconSrc('/images/plus-white-bold.svg') }}
                onMouseLeave={() => { setPlusIconSrc(getPlusIconSrc()) }}
                onClick={handleOpenDialog}
                data-testid="add-role"
            >
                Add role
            </Button>

            <DialogLayoutModified ref={addRoleDialogRef}
                headingText={'New role'} mainActionText={'Save'}
                secondaryActionText={'Cancel'}
                isMainActionDisabled={!checkIfRoleNameIsValid() ? true : false}
                handleSubmitMainAction={handleSave}
                handleSubmitSecondaryAction={handleClose}
            >

                {rolesForSelect.length === 0 ?
                    <>
                        <Box style={{
                            marginTop: '20px',
                            padding: 10,
                            backgroundColor: '#fff',
                            border: `1px solid #6CACE4`,
                            borderRadius: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',

                        }}>
                            <p style={{ flex: 'none', flexGrow: 1, order: 0, fontWeight: 600 }}>
                                <img src='/images/info-blue.svg' alt='info' style={{ marginRight: 10, width: 15 }} />
                                Note:
                            </p>

                            <Box style={{ flex: 'none', flexGrow: 1, order: 1, paddingLeft: 23, fontWeight: 500 }}>
                                <ul style={{ listStyleType: 'disc', margin: 0 }}>
                                    <li style={{ listStylePosition: 'inside' }}>
                                        Make sure that the role name matches a role already created in Reltio
                                    </li>
                                    <li style={{ listStylePosition: 'inside' }}>
                                        To load the roles already in Reltio check the instruction in the&nbsp;
                                        <Link
                                            href={documentation}
                                            target="_blank"
                                            rel="noopener"
                                            variant="body1"
                                            underline="hover"
                                            style={{ fontWeight: 500 }}>
                                            documentation
                                        </Link>
                                    </li>
                                </ul>
                            </Box>
                        </Box>
                        <p style={{ fontWeight: 500, fontSize: '16px', margin: '20px 0 10px 0' }}>Enter role name</p>
                        <TextField
                            id="outlined-name"
                            variant="filled"
                            fullWidth
                            value={name}
                            onChange={handleChange}
                            sx={{ marginTop: 0 }} />
                    </>
                    :
                    <>
                        <p style={{ fontWeight: 500, fontSize: '16px', margin: '20px 0 10px 0' }}>Select a role to add to the configuration</p>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tenant Roles</InputLabel>
                            <Select
                                id="demo-simple-select"
                                value={name}
                                onChange={handleChange}
                                label="Tenant Roles"
                            >
                                {rolesForSelect.map(role => {
                                    return (
                                        <MenuItem value={role}>
                                            <ListItemText primary={role} />
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </>
                }

                <div style={{ margin: '10px 0' }}>
                    <Switch
                        checked={isSwitchChecked}
                        onChange={() => setIsSwitchChecked(!isSwitchChecked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#77787C' }}>Copy permissions from other role</span>
                </div>

                {isSwitchChecked ?
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select role</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedRole.name}
                            label="Select role"
                            onChange={handleRoleSelectChange}
                        >
                            {rolesState.allRolesCollection.map(roleObject => {
                                return (
                                    <MenuItem key={roleObject.tableId} value={roleObject.displayName} data-itemid={roleObject.tableId} name={roleObject.tableId}>
                                        <ListItemText primary={roleObject.displayName} />
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    :
                    <></>
                }
            </DialogLayoutModified>
        </Box>
    )
}

export default AddRole
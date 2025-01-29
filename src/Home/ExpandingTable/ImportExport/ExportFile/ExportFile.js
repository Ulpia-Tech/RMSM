import { Button, Icon, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRef, useState } from 'react';
import { usePermissionsCollection } from '../../../../Context/PermissionsContext/PermissionsContextProvider';
import { ProcessPermissionsFileForExport } from "../../../../utils/process-permissions-file-for-export/process-permissions-file-for-export";
import ApiConnection from '../connection/api-connection';
import DialogLayoutModified from '../../../../shared/components/DialogLayoutModified/DialogLayoutModified';
import ReltioConnectionForm from '../ReltioConnectionForm/ReltioConnectionForm';

const defaultImgSrc = (btnVariant) => {
    const color = btnVariant === 'outlined' ? 'blue' : 'white';
    return `/images/download-${color}.svg`;
}

const ExportFile = ({ btnVariant = 'outlined' }) => {
    const connectionDialogRef = useRef();
    const [connectionError, setConnectionError] = useState(false);

    const { state: permissionsCollectionState } = usePermissionsCollection();
    const [imgSrc, setImgSrc] = useState(defaultImgSrc(btnVariant));
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleDialogOpen = () => {
        setConnectionError(false);
        connectionDialogRef.current.handleOpen();
    }

    const handleDialogClose = () => {
        connectionDialogRef.current.handleClose();
    }

    const svgIcon = (<Icon> <img
        src={imgSrc}
        alt="download"></img> </Icon>);

    const handleExportToFile = () => {
        const modifiedCollection = ProcessPermissionsFileForExport.process(permissionsCollectionState.originalPermissionsCollection);
        // loader

        let dataStr = JSON.stringify(modifiedCollection);
        let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        let exportFileDefaultName = 'data.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        handleMenuClose();
    }

    async function handlePushToReltio(tenantURL, tenantID, securityToken) {
        ApiConnection.createInstance(tenantURL, tenantID, securityToken);
        const modifiedCollection = ProcessPermissionsFileForExport.process(permissionsCollectionState.originalPermissionsCollection);
        try {
            await ApiConnection.postConfig(modifiedCollection);
        } catch (error) {
            setConnectionError(true);
            return;
        }
        handleDialogClose();
    }

    return (
        <>
            <Button
                id='dropdown-button'
                aria-controls={open ? 'dropdown-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                data-testid="download-config-file"
                onMouseEnter={() => { setImgSrc(`/images/download-white.svg`) }}
                onMouseLeave={() => { setImgSrc(defaultImgSrc(btnVariant)) }}
                variant={btnVariant}
                startIcon={svgIcon}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ fontSize: '13px' }}
                color="primary"
                fullWidth
                onClick={handleMenuOpen}
            >Export permissions</Button>

            <Menu
                id='dropdown-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'dropdown-button',
                }}
            >
                <MenuItem onClick={handleExportToFile}>Download file</MenuItem>
                <MenuItem onClick={handleDialogOpen}>Push to Reltio</MenuItem>
            </Menu>

            <DialogLayoutModified ref={connectionDialogRef}
                headingText={'Send configuration to tenant'}
                mainActionText={''}
            >
                <ReltioConnectionForm onSubmitMethod={handlePushToReltio} buttonText={'Push configuration to tenant'} hasError={connectionError} />
            </DialogLayoutModified>
        </>
    )
}

export default ExportFile
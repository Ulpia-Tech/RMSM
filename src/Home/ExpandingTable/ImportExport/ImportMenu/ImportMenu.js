import { Button, Icon, Tab, Tabs } from "@mui/material";
import { useRef, useState } from "react";
import { useRolesCollection } from "../../../../Context/RolesContext/RolesContextProvider";
import DialogLayoutModified from "../../../../shared/components/DialogLayoutModified/DialogLayoutModified";
import WarningContainer from "../../../../shared/components/WarningContainer/WarningContainer";
import PullFromReltio from "./PullFromReltio";
import UploadFile from "./UploadFile/UploadFile";

const defaultImgSrc = (btnVariant) => {
    const color = btnVariant === 'outlined' ? 'blue' : 'white';
    return `/images/upload-${color}.svg`;
}

const ImportMenu = ({ btnVariant = 'outlined' }) => {
    const importDialogRef = useRef();
    const confirmDialogRef = useRef();

    const [imgSrc, setImgSrc] = useState(defaultImgSrc(btnVariant));
    const [selectedTab, setSelectedTab] = useState(0);

    const { state: rolesState } = useRolesCollection();

    const svgIcon = (<Icon> <img
        src={imgSrc}
        alt="upload"></img> </Icon>);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    }

    const handleOpenDialog = () => {
        importDialogRef.current.handleOpen();
        handleCloseConfirm();
    }

    const handleCloseDialog = () => {
        importDialogRef.current.handleClose();
    }

    const handleOpenConfirm = () => {
        confirmDialogRef.current.handleOpen();
    }

    const handleCloseConfirm = () => {
        confirmDialogRef.current.handleClose();
    }

    const handleImportOpenButton = () => {
        if (rolesState.allRolesCollection.length !== 0) {
            handleOpenConfirm();
        } else {
            handleOpenDialog();
        }
    }

    return (
        <>
            <Button variant={btnVariant} onClick={handleImportOpenButton}
                onMouseEnter={() => { setImgSrc(`/images/upload-white.svg`) }}
                onMouseLeave={() => { setImgSrc(defaultImgSrc(btnVariant)) }}
                startIcon={svgIcon}
                fullWidth
                data-testid="upload-config-file"
            >Import config file</Button>

            <DialogLayoutModified ref={importDialogRef}
                headingText={'Import data'}
                mainActionText={''}
            >
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label='Upload files from computer' />
                    <Tab label='Connect to reltio tenant' />
                </Tabs>
                {selectedTab === 0 && <UploadFile closeImportDialog={handleCloseDialog} />}
                {selectedTab === 1 && <PullFromReltio closeImportDialog={handleCloseDialog} />}
            </DialogLayoutModified>

            <DialogLayoutModified ref={confirmDialogRef} headingText='Confirmation'
                mainActionText={'Continue'} secondaryActionText={'Cancel'}
                handleSubmitMainAction={handleOpenDialog}
                handleSubmitSecondaryAction={handleCloseConfirm}
            >
                <WarningContainer description={'Uploading a new file will delete the previous configuration. Are you sure you want to continue?'} />
            </DialogLayoutModified>
        </>
    )
}

export default ImportMenu;
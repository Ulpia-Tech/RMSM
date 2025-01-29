import { Button } from "@mui/material";
import { useState } from "react";
import { useActiveFiltersCounter } from "../../../../../Context/ActiveFiltersCounterContext/ActiveFiltersCounterContextProvider";
import { useLoading } from "../../../../../Context/LoadingContext/LoadingContextProvider";
import { usePermissionsCollection } from "../../../../../Context/PermissionsContext/PermissionsContextProvider";
import { PermissionsStore } from "../../../../../Context/PermissionsContext/PermissionStore";
import { useReactTableLibContext } from "../../../../../Context/ReactTableLibContext/ReactTableLibContextProvider";
import { useRolesCollection } from "../../../../../Context/RolesContext/RolesContextProvider";
import { RoleStore } from "../../../../../Context/RolesContext/RoleStore";
import UploadItem from "./UploadItem/UploadItem";
import { useNavigate } from "react-router-dom"
import { useValidationErrorsCollection } from "../../../../../Context/ValidationErrorsContext/ValidationErrorsContextProvider";
import { processL3File } from "../../../../../utils/process-l3";
import { useUploadedFiles } from "../../../../../Context/UploadedFilesContext/UploadedFilesContextProvider";
import { useTenantRolesCollection } from "../../../../../Context/TenantRolesContext/TenantRolesContextProvider";
import { processTenantRoles } from "../../../../../utils/process-tenant-roles";

const L3_FILE_ID = 'L3_FILE';
const PERMISSION_FILE_ID = 'PERMISSION_FILE';
const CUSTOM_ROLES_FILE_ID = 'CUSTOM_ROLES_FILE';

const UploadFile = ({ closeImportDialog }) => {
    const { state: permissionsCollectionState, dispatch: permissionsCollectionDispatcher } = usePermissionsCollection();
    const { setLoading } = useLoading();
    const { setActiveFiltersCollection: setActiveFiltersCollectionState } = useActiveFiltersCounter();
    const { setDerivedMode: setDerivedModeState } = useReactTableLibContext();
    const { setCustomTenantRolesCollection } = useTenantRolesCollection();
    const { setValidationErrorsCollection, setValidationVisibility } = useValidationErrorsCollection();

    const { setL3Data } = useUploadedFiles();
    const navigate = useNavigate();

    const { dispatch: rolesDispatcher } = useRolesCollection();

    const [L3File, setL3File] = useState(null);
    const [configurationFile, setConfigurationFile] = useState(null);
    const [customRolesFile, setCustomRolesFile] = useState(null);

    const handleReceiveSelectedFile = (parsedFile, id) => {
        if (id === L3_FILE_ID) {
            setL3File(parsedFile);
        } else if (id === PERMISSION_FILE_ID) {
            setConfigurationFile(parsedFile);
        }
        id === CUSTOM_ROLES_FILE_ID && setCustomRolesFile(parsedFile);
    }

    const handleDeleteSelectedFile = (id) => {
        if (id === L3_FILE_ID) {
            setL3File(null);
            setL3Data(null);
        }
        if (id === PERMISSION_FILE_ID) {
            setConfigurationFile(null);
        }
        id === CUSTOM_ROLES_FILE_ID && setCustomRolesFile(null);
    }

    const handleUpload = () => {
        setActiveFiltersCollectionState([]);
        setDerivedModeState(false);
        setValidationErrorsCollection([]);
        setValidationVisibility(false);

        setLoading(true);
        let mergedFile = [];
        if (L3File) {
            let configurationL3 = null;
            configurationL3 = processL3File(L3File);
            setL3Data(configurationL3);
            mergedFile = [...mergedFile, ...configurationL3];
        }
        if (configurationFile) {
            mergedFile = [...mergedFile, ...configurationFile];
        }
        permissionsCollectionDispatcher({ type: PermissionsStore.action_types.INITIAL_PROCESS, payload: { mergedFile } });
        if (L3File || configurationFile) {
            rolesDispatcher({ type: RoleStore.action_types.INIT_ROLES });
        }
        customRolesFile && setCustomTenantRolesCollection(processTenantRoles(customRolesFile));
        closeImportDialog();
        navigate("/config");
    }

    let canUpload = false;
    if (permissionsCollectionState.originalPermissionsCollection.length === 0) {
        canUpload = L3File || configurationFile;
    } else {
        canUpload = L3File || configurationFile || customRolesFile;
    }

    return (
        <>
            <UploadItem heading={'L3 configuration'} id={L3_FILE_ID}
                onReceiveSelectedFile={handleReceiveSelectedFile} onDeleteSelectedFile={handleDeleteSelectedFile} />

            <UploadItem heading={'Permission configuration'} id={PERMISSION_FILE_ID}
                onReceiveSelectedFile={handleReceiveSelectedFile} onDeleteSelectedFile={handleDeleteSelectedFile} />

            <UploadItem heading={'Custom roles file'} id={CUSTOM_ROLES_FILE_ID}
                onReceiveSelectedFile={handleReceiveSelectedFile} onDeleteSelectedFile={handleDeleteSelectedFile} />

            <Button variant="contained" fullWidth sx={{ marginTop: 3, marginBottom: 3 }} onClick={handleUpload} disabled={!canUpload}>Upload</Button>
        </>
    )
}

export default UploadFile
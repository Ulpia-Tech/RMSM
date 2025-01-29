import { usePermissionsCollection } from "../../../../Context/PermissionsContext/PermissionsContextProvider";
import { PermissionsStore } from "../../../../Context/PermissionsContext/PermissionStore";
import { useRolesCollection } from "../../../../Context/RolesContext/RolesContextProvider";
import { RoleStore } from "../../../../Context/RolesContext/RoleStore";
import { useNavigate } from "react-router-dom"
import { useUploadedFiles } from "../../../../Context/UploadedFilesContext/UploadedFilesContextProvider";
import { processL3File } from "../../../../utils/process-l3";
import ApiConnection from "../connection/api-connection";
import ReltioConnectionForm from "../ReltioConnectionForm/ReltioConnectionForm";
import { useState } from "react";
import { Backdrop, Box, CircularProgress, useTheme } from "@mui/material";

const PullFromReltio = ({ closeImportDialog }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { setL3Data } = useUploadedFiles();
    const { state: permissionsCollectionState, dispatch: permissionsCollectionDispatcher } = usePermissionsCollection();
    const { dispatch: rolesDispatcher } = useRolesCollection();

    const [connectionError, setConnectionError] = useState(false);
    const [backdropOpen, setBackdropOpen] = useState(false);

    async function pullFiles(tenantURL, tenantID, securityToken) {
        ApiConnection.createInstance(tenantURL, tenantID, securityToken);
        let l3Response = null;
        let configResponse = null;
        setBackdropOpen(true);
        try {
            l3Response = await ApiConnection.getL3();
            configResponse = await ApiConnection.getConfig();
        } catch (err) {
            setConnectionError(true);
            setBackdropOpen(false);
            return;
        }

        let mergedFile = [];
        if (l3Response) {
            let configurationL3 = null;
            configurationL3 = processL3File(l3Response);
            setL3Data(configurationL3);
            mergedFile = [...mergedFile, ...configurationL3];
        }
        if (configResponse) {
            mergedFile = [...mergedFile, ...configResponse];
        }
        permissionsCollectionDispatcher({ type: PermissionsStore.action_types.INITIAL_PROCESS, payload: { mergedFile } });

        if (l3Response !== null || configResponse !== null) {
            rolesDispatcher({ type: RoleStore.action_types.INIT_ROLES });
        }
        setBackdropOpen(false);
        closeImportDialog();
        navigate("/config");
    }

    return (
        <>
            {permissionsCollectionState.originalPermissionsCollection.length === 0
                ?
                <ReltioConnectionForm onSubmitMethod={pullFiles} buttonText={'Pull files from tenant'} hasError={connectionError} />
                :
                <Box style={{
                    marginTop: '20px',
                    marginBottom: '20px',
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
                        You can only connect to Reltio to import data from the start screen
                    </Box>
                </Box>}

            <Backdrop
                sx={{ color: theme.palette.gray.light, zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropOpen}
            >
                <CircularProgress />
            </Backdrop>
        </>
    )
}

export default PullFromReltio;
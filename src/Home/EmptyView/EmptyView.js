import { Box, Button } from "@mui/material";
import { usePermissionsCollection } from "../../Context/PermissionsContext/PermissionsContextProvider";
import { PermissionsStore } from "../../Context/PermissionsContext/PermissionStore";
import { useRolesCollection } from "../../Context/RolesContext/RolesContextProvider";
import { RoleStore } from "../../Context/RolesContext/RoleStore";
import configurationFile from "../../utils/demo-file-small.json";
import { PermissionsFormatChecker } from "../../utils/permissions-format-checker";
import ImportMenu from "../ExpandingTable/ImportExport/ImportMenu/ImportMenu";
import { useNavigate } from "react-router-dom"

const EmptyView = () => {

    const { dispatch: permissionsCollectionDispatcher } = usePermissionsCollection();
    const {
        dispatch: rolesDispatcher,
    } = useRolesCollection();

    const navigate = useNavigate();

    const testUpload = () => {
        if (!PermissionsFormatChecker.validateFile(configurationFile)) { return; }
        permissionsCollectionDispatcher({ type: PermissionsStore.action_types.INITIAL_PROCESS, payload: { mergedFile: configurationFile } })
        rolesDispatcher({ type: RoleStore.action_types.INIT_ROLES })
        navigate("/config");
    }

    return (<>
        <Box data-testid="empty-view-container" backgroundColor={'#fff'}>
            <Box width={'100%'} height={'400px'} display={'flex'} justifyContent={'center'} textAlign={'center'} alignItems={'center'} mt={2}>
                <Box width={'500px'} textAlign={'center'}>
                    {/* <img style={{ marginTop: 0 }} src={'/images/no-files-yet.svg'} alt="no-files-yet" /> */}
                    <Box py={3} fontWeight={'600'} fontSize={'14px'} color={'#BBBCBE'}>
                        <p>No files yet.</p>
                        <p>Upload L3 Config and/or Permission Config file to begin.</p>
                    </Box>
                    <Box textAlign={'center'} display={'flex'} justifyContent={'center'}>
                        <Box width={'200px'}>
                            <ImportMenu btnVariant="contained" />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Button data-testid="test-app-btn" sx={{ textDecoration: "underline", marginLeft: 1 }} variant={'text'} onClick={testUpload}>Test the app</Button>
        </Box>
    </>


    )
}

export default EmptyView
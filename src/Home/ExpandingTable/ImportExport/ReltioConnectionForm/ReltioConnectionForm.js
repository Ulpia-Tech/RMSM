import { Box, Button, TextField, useTheme } from "@mui/material";
import { useTenantConnection } from "../../../../Context/TenantConnectionContext/TenantConnectionContextProvider";

const ReltioConnectionForm = ({ onSubmitMethod, buttonText, hasError }) => {
    const ReltioConnection = useTenantConnection();
    const theme = useTheme();

    const handleURLChange = (event) => {
        ReltioConnection.setTenantURL(event.target.value);
    }
    const handleIDchange = (event) => {
        ReltioConnection.setTenantID(event.target.value);
    }
    const handleTokenChange = (event) => {
        ReltioConnection.setSecurityToken(event.target.value);
    }

    const handleSubmit = () => {
        onSubmitMethod(ReltioConnection.tenantURL, ReltioConnection.tenantID, ReltioConnection.securityToken);
    }

    const canConnect = ReltioConnection.tenantURL && ReltioConnection.tenantID && ReltioConnection.securityToken;

    return (
        <>
            {hasError && (
                <Box sx={{ marginBottom: 2, backgroundColor: '#fff', border: `1px solid ${theme.palette.error.main}`, padding: 1 }}>
                    <img src={'../images/attention-triangle-red.svg'} alt={'attention'} style={{ width: '20px', marginRight: '15px' }} />
                    There is a problem with the Reltio connection
                </Box>
            )}
            <Box style={{ marginTop: '30px' }}>
                <TextField fullWidth required label='Tenant URL' value={ReltioConnection.tenantURL} onChange={handleURLChange} style={{ marginBottom: 30 }} />
                <TextField fullWidth required label='Tenant ID' value={ReltioConnection.tenantID} onChange={handleIDchange} />
                <TextField fullWidth required label='Security Token' value={ReltioConnection.securityToken} onChange={handleTokenChange} style={{ marginTop: 30 }} />
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ marginTop: 3, marginBottom: 3 }}
                    onClick={handleSubmit}
                    disabled={!canConnect}
                >
                    {buttonText}
                </Button>
            </Box >
        </>
    );
}

export default ReltioConnectionForm;
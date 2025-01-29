import { Box } from "@mui/material";
import AddRole from "../AddRole/AddRole";

const NoRolesView = () => {
    return (
        <Box width={'100%'} height={'400px'} display={'flex'} justifyContent={'center'} textAlign={'center'} alignItems={'center'} backgroundColor={'#fff'} mt={2}>
            <Box width={'500px'} textAlign={'center'}>
                <Box py={3} fontWeight={'100'} fontSize={'14px'} color={'#F72407'}>
                    <p>There should be at least one visible role.</p>
                    <p>Create a new role or use the "Filter roles" filter to select one</p>
                </Box>
                <Box textAlign={'center'} display={'flex'} justifyContent={'center'}>
                    <Box width={'200px'}>
                        <AddRole />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default NoRolesView;
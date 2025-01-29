import { Box, useTheme } from '@mui/material';
import ClipLoader from "react-spinners/ClipLoader";


const Loading = () => {
    const theme = useTheme();

    return (
        <Box width={'100%'} height={'100%'}>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} pt={10}>
                <ClipLoader color={theme.palette.primary.main} loading={true} size={50} />
            </Box>
        </Box>
    )
}

export default Loading
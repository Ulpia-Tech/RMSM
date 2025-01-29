import { Box } from "@mui/material"

const WarningContainer = ({ description, imgPath = '/images/attention-orange.svg' }) => {

    return (
        <>
            <Box textAlign={'center'} mt={3}>
                <img src={imgPath} alt="attention"/>
                <div>
                    { description }
                </div>
            </Box>
        </>
    )
}

export default WarningContainer
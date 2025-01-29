import { Popover, Typography } from '@mui/material';
import { useState } from 'react';

const WarningPopup = ({ message, style }) => {
    const [popoverState, setPopoverState] = useState();

    const handlePopoverOpen = (event) => {
        setPopoverState(event.currentTarget);
    }

    const handlePopoverClose = () => {
        setPopoverState(null);
    }

    return (
        <>
            <span
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                style={{width: 'auto'}}
            >
                <img src={'/images/exclamation-mark-orange.svg'} alt={'warning'} style={style} />
            </span>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                open={Boolean(popoverState)}
                anchorEl={popoverState}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 2 }}>{message}</Typography>
            </Popover>
        </>
    );
}

export default WarningPopup;
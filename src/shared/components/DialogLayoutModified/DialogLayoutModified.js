import { Button } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { forwardRef, useImperativeHandle, useState } from "react";
import "./dialogLayout.css";


const DialogLayoutModified = forwardRef(({ children, headingText, mainActionText,
    handleSubmitMainAction, handleSubmitSecondaryAction,
    isMainActionDisabled = false, secondaryActionText = null }, ref) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    useImperativeHandle(ref, () => ({
        handleClose,
        handleOpen
    }))

    const handleOpen = () => {
        setOpen(true);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmitMainAction();
        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm"
                onKeyPress={handleKeyPress}>

                <div className="dialog-header">
                    <span>{headingText}</span>
                    <span><img data-testid="dialog-close-icon" className="dialog-header-img" src="/images/cross-gray.svg" alt='cross' onClick={handleClose}></img></span>
                </div>

                <div className="dialog-body">
                    {children}
                </div>

                {!!mainActionText &&
                    <div className="dialog-actions">
                        {!!secondaryActionText &&
                            <Button variant="outlined" onClick={handleSubmitSecondaryAction}
                                className="dialog-actions-first" sx={{ marginRight: 1 }} fullWidth>{secondaryActionText}</Button>
                        }
                        <Button variant="contained" fullWidth sx={{ marginLeft: 1 }}
                            onClick={handleSubmitMainAction} disabled={isMainActionDisabled} className="dialog-actions-second">{mainActionText}</Button>
                    </div>
                }
            </Dialog>
        </>
    )
})

export default DialogLayoutModified;

DialogLayoutModified.propTypes = {
    mainActionText: PropTypes.string.isRequired,
    isMainActionDisabled: PropTypes.bool
}
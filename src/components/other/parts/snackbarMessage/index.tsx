import React, { Fragment, SyntheticEvent } from "react"
import CloseIcon from '@material-ui/icons/Close'
import { Snackbar, IconButton, SnackbarCloseReason } from "@material-ui/core"

interface IProps {
    open: boolean
    handleClose?: (event: SyntheticEvent<any, Event>, reason?: SnackbarCloseReason) => void
    message?: string
}
const SnackbarMessage = ({ open, message, handleClose }: IProps) => {
    return (
        <Fragment>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message={message || 'Something went wrong'}
                action={
                <Fragment>
                    <IconButton 
                        size="small" 
                        aria-label="close" 
                        onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Fragment>
                }
            />
        </Fragment>
    )
}

export default SnackbarMessage

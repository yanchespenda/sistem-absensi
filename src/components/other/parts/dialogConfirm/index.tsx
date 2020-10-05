import React, { Fragment } from "react"
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core"

interface IProps {
    open: boolean
    useAction?: boolean
    confirmMessage?: string
    confirmMessageBody?: string
    closeCallback?: () => void
}
const DialogConfirmComponent = ({ open, useAction, confirmMessage, confirmMessageBody, closeCallback }: IProps) => {
    const [openDialog, setOpenDialog] = React.useState(open)

    const handleClose = () => {
        setOpenDialog(false)

        if (closeCallback) {
            closeCallback()
        }
    }

    const isUseAction = useAction ? useAction : true
    const useConfirmMessage = confirmMessage || 'Are you sure'

    return (
        <Fragment>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{useConfirmMessage}</DialogTitle>
                {
                    confirmMessageBody ? (
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                { confirmMessageBody }
                            </DialogContentText>
                        </DialogContent>
                    ) : null
                }
                {
                    isUseAction ? (
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                No
                            </Button>
                            <Button onClick={handleClose} color="primary" autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    ) : null
                }
            </Dialog>
        </Fragment>
    )

}

export default DialogConfirmComponent

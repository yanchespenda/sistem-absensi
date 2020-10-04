import React, { Fragment } from "react"
import axios from "axios"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Paper, Popper, Grow, ClickAwayListener, IconButton, MenuList, MenuItem, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, ListItemIcon } from "@material-ui/core"
import { UserMenu } from "../../../interfaces"

import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import MenuIconComponent from "./MenuIcon"
import { Link } from "react-router-dom"
import { deleteStorageItem } from "../../../helper/localStorage"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        paper: {
            marginRight: theme.spacing(2),
        },

        avatarImg: {
            width: '36px',
            height: '36px',
            position: 'relative'
        },
        avatar: {
            width: '100%',
            height: '100%',
            borderRadius: '50%'
        }
    }),
)

interface IProps {
    data: UserMenu
}

function OtherToolbarMenuComponent({ data }: IProps) {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const anchorRef = React.useRef<HTMLButtonElement>(null)

    const [openDialogLogout, setOpenDialogLogout] = React.useState(false)

    const handleDialogLogoutOpen = () => {
        setOpenDialogLogout(true);
    }

    const handleDialogLogoutClose = (isLogoutConfirm?: boolean) => {
        setOpenDialogLogout(false);

        if (isLogoutConfirm) {
            deleteStorageItem('token')
            delete axios.defaults.headers.common['Authorization']
            window.location.reload()
        }
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const handleClose = (event?: React.MouseEvent<EventTarget>) => {
        if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
            return
        }
    
        setOpen(false)
    }

    const handleLogout = () => {
        handleClose()
    }

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
          event.preventDefault()
          setOpen(false)
        }
    }

    const prevOpen = React.useRef(open)
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus()
        }

        prevOpen.current = open
    }, [open])

    const getAvatar = data.avatar || false

    return (
        <Fragment>
            <div className={classes.root}>
                <div>
                    {
                        getAvatar ? (
                            <Fragment>
                                <IconButton 
                                    aria-label="avatar"
                                    ref={anchorRef}
                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                    aria-haspopup="true"
                                    onClick={handleToggle}
                                    disableRipple
                                >
                                    <div className={classes.avatarImg}>
                                        <img src={getAvatar} className={classes.avatar} />
                                    </div>
                                </IconButton>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <IconButton 
                                    aria-label="avatar"
                                    ref={anchorRef}
                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                    aria-haspopup="true"
                                    onClick={handleToggle}
                                >
                                    <AccountCircleIcon />
                                </IconButton>
                            </Fragment>
                        )
                    }
                    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={ handleListKeyDown }>
                                            {
                                                data.menu.map((item, idx) => {
                                                    return (
                                                        <Link key={idx} to={item.url}>
                                                            <MenuItem onClick={handleClose}>
                                                                {
                                                                    item.icon.enable ? (
                                                                        <ListItemIcon><MenuIconComponent icon={ item.icon.name } /></ListItemIcon>
                                                                    ):('')
                                                                }
                                                                <Typography variant="inherit" noWrap>{ item.title }</Typography>
                                                            </MenuItem>
                                                        </Link>
                                                    )
                                                })
                                            }
                                            <MenuItem onClick={ handleLogout && handleDialogLogoutOpen }>
                                                <ListItemIcon>
                                                    <ExitToAppIcon />
                                                </ListItemIcon>
                                                <Typography variant="inherit">Logout</Typography>
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </div>
            </div>
        
            <Dialog
                open={openDialogLogout}
                onClose={() => handleDialogLogoutClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure want logout?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        We will redirect you to login page
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogLogoutClose(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleDialogLogoutClose(true)} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default OtherToolbarMenuComponent

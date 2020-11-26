import React, { Fragment, useEffect, useState } from "react"
import axios from "axios"
import useSWR from "swr"
import { Formik, Form, Field, FormikProps } from 'formik'
import * as yup from "yup"
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, makeStyles, Theme, createStyles, TablePagination, Toolbar, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Switch, FormControlLabel, InputAdornment } from "@material-ui/core"
import { TextField } from 'formik-material-ui'
import AddIcon from '@material-ui/icons/Add'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import SnackbarMessage from "../../other/parts/snackbarMessage"
import { TimeLocal } from "../../../helper/dateTime"
// import DeleteIcon from '@material-ui/icons/Delete'
// import RefreshIcon from '@material-ui/icons/Refresh'
// import EditIcon from '@material-ui/icons/Edit'

interface tableData {
    no: number
    id: number
    username: string
    lastAttendAt: string | null
    lastLoggedAt: string | null
}

// function createData(no: number, id: number, username: string, lastAttendAt: string | null, lastLoggedAt: string | null): tableData {
//     return { no, id, username, lastAttendAt, lastLoggedAt }
// }

interface IProps {
    titleHandler: (title: string) => void
}

interface SWRDataConfig {
    currentPage: number
    perPage: number
    totalItems: number
}
interface SWRDataItems extends tableData {
}
interface SWRData {
    config: SWRDataConfig
    items: SWRDataItems[]
}

interface UserDialogData {
    username: string
    lastAttendAt: string
    createdAt: string
    avatar: string
}
interface InterfaceUserForm {
    username: string
    password: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            position: 'relative',
        },

        // Toolbar
        mainToolbar: {
            backgroundColor: theme.palette.primary.main,
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
        },

        // Table
        headRowCellNo: {
            width: '15%',
        },
        headRowCellUsername: {
            width: '55%',
        },
        headRowCellDateTime: {
            width: '15%',
        },

        // User Dialog
        userDialog: {
            width: '400px'
        },
        userDialogAvatarBox: {
            marginBottom: '24px',
        },
        userDialogAvatarContainer:{
            height: '144px',
            width: '144px',
            marginBottom: '8px',
        },
        userDialogAvatar: {
            width: '100%',
            height: '100%',
            borderRadius: '50%'
        },
        userDialogAvatarInput: {
            display: 'none',
        }
    }),
)

function AdminUserComponent({titleHandler}: IProps) {
    const classes = useStyles()

    // const [loading, setLoading] = React.useState<boolean>(false);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [userDialogOpen, setUserDialogOpen] = useState(false)
    const [userDialogLoading, setUserDialogLoading] = useState(false)
    const [userDialogData, setUserDialogData] = useState<UserDialogData>({
        avatar: '',
        createdAt: '',
        lastAttendAt: '',
        username: ''
    })
    const [userDialogId, setUserDialogId] = useState(0)
    const [userDialogAvatarLoading, setUserDialogAvatarLoading] = useState(false)
    const [userDialogChangePassword, setUserDialogChangePassword] = useState(false)
    const [userDialogPasswordShow, setUserDialogPasswordShow] = useState(false)
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [snackBarMessage, setSnackBarMessage] = useState('')
    const [dialogConfirm, setDialogConfirm] = useState(false)
    const [dialogConfirmMessage, setDialogConfirmMessage] = useState('')

    const { data, revalidate } = useSWR<SWRData>(`api/admin/user?perPage=${rowsPerPage}&page=${page}`)
    
    useEffect(() => {
        titleHandler('User Management')
    }, [titleHandler])

    const handleDialogClose = () => {
        if (!userDialogLoading)
            setUserDialogOpen(false)
    }
    const handleDialogOpen = (id: number) => {
        setUserDialogLoading(true)
        setUserDialogId(id)
        axios.get<UserDialogData>(`/api/admin/user/${id}/edit`).then(res => {
            setUserDialogData(res.data)
            setUserDialogChangePassword(false)
            setUserDialogPasswordShow(false)
            setUserDialogOpen(true)
        }).catch(err => {
            setSnackBarOpen(true)
            setSnackBarMessage('Something went wrong')
            console.log('err', err)
        }).then( () => {
            setUserDialogLoading(false)
        })
    }
    const handleDialogSave = (data: InterfaceUserForm, resetForm: Function, isLoading: Function) => {
        setUserDialogLoading(true)
        const formData = new FormData()
        formData.append('username', data.username)
        if (userDialogChangePassword && data.password.toString().length > 0) {
            formData.append('password', data.password)
        }
        axios.post<UserDialogData>(`/api/admin/user/${userDialogId}/save`, formData).then(res => {
            resetForm({})
            setUserDialogOpen(false)

            setSnackBarOpen(true)
            setSnackBarMessage('User saved')
        }).catch(err => {
            setSnackBarOpen(true)
            setSnackBarMessage('Something went wrong')
            console.log('err', err)
        }).then( () => {
            isLoading(false)
            setUserDialogLoading(false)
        })
    }

    const handleSnackbarMessage = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return
        }
    
        setSnackBarOpen(false)
    }

    const handleChangePage = (_event: unknown, newPage: number) => {
        // console.log('handleChangePage', newPage)
        setPage(newPage)
    }
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        // console.log('handleChangeRowsPerPage', event.target.value)
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleAvatarChange = (e: FileList | null) => {
        if (e && e[0]) {
            setUserDialogAvatarLoading(true)
            const formData = new FormData()
            formData.append('avatar', e[0])
            axios.post<UserDialogData>(`/api/admin/user/${userDialogId}/avatar`, formData).then(res => {
                setUserDialogData(res.data)
                setSnackBarOpen(true)
                setSnackBarMessage('Avatar changed')
            }).catch(err => {
                setSnackBarOpen(true)
                setSnackBarMessage('Something went wrong')
                console.log('err', err)
            }).then( () => {
                setUserDialogAvatarLoading(false)
            })
        }
    }

    const handleDeleteDialog = (id: number) => {
        setDialogConfirm(true)
        setUserDialogId(id)
        setDialogConfirmMessage('Are you sure to delete this user?')
    }

    const handleDeleteConfirm = (confirm: boolean) => {
        if (confirm) {
            axios.delete(`/api/admin/user/${userDialogId}/delete`).then(res => {
                setSnackBarOpen(true)
                setSnackBarMessage(res.data.message)

                revalidate()
            }).catch(err => {
                setSnackBarOpen(true)
                setSnackBarMessage('Something went wrong')
                console.log('err', err)
            }).then( () => {
                setDialogConfirm(false)
            })
        } else {
            setDialogConfirm(false)
        }
    }

    return (
        <Fragment>
            <div className="sectionContainer">
                <div className="container">
                    <Paper>
                        <Toolbar className={classes.mainToolbar}>
                            <div className="flex"></div>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="new data"
                            >
                                <AddIcon />
                            </IconButton>
                        </Toolbar>
                        <TableContainer className={classes.root}>
                            <Table aria-label="data table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.headRowCellNo}>No</TableCell>
                                        <TableCell className={classes.headRowCellUsername}>Username</TableCell>
                                        <TableCell className={classes.headRowCellDateTime} align="right">Last attended</TableCell>
                                        <TableCell className={classes.headRowCellDateTime} align="right">Last logged</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data?.items.map((row) => (
                                            <TableRow key={row.no}>
                                                <TableCell component="th" scope="row">
                                                    {row.no}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="layout-column">
                                                        <span>{row.username}</span>
                                                        <div className="layout-row">
                                                            <Typography className="selecableContent" variant="caption" component="span" onClick={() => handleDialogOpen(row.id)}>Edit</Typography>
                                                            {'\u00A0|\u00A0'}
                                                            <Typography className="selecableContent" variant="caption" component="span" onClick={() => handleDeleteDialog(row.id)}>Delete</Typography>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right">
                                                    {
                                                        row.lastAttendAt === null ? 'None' : TimeLocal(row.lastAttendAt)
                                                    }
                                                </TableCell>
                                                <TableCell align="right">
                                                    {
                                                        row.lastLoggedAt === null ? 'None' : TimeLocal(row.lastLoggedAt)
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {
                            data ? (
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={data?.config?.totalItems || 0}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            ) : null
                        }
                    </Paper>
                </div>
            </div>
            
            {/* Edit User Dialog */}
            <Dialog open={userDialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit user</DialogTitle>
                <Formik 
                    initialValues={{
                        username: userDialogData.username,
                        password: ''
                    }}
                    validationSchema={yup.object().shape({
                        username: yup.string()
                            .required('Username required'),
                        password: !userDialogChangePassword ? yup.string().min(6, 'To short').max(25, 'To long') : yup.string().required('Password required').min(6, 'To short').max(25, 'To long')
                    })}
                    onSubmit={(values: InterfaceUserForm, { resetForm, setSubmitting}) => {
                        console.group('onSubmit')
                        console.log('values', values)
                        console.groupEnd()
                        handleDialogSave(values, resetForm, setSubmitting)
                    }}
                >
                    {
                        (props: FormikProps<InterfaceUserForm>) => {
                            const {
                                touched,
                                errors,
                                handleBlur,
                                handleChange,
                                isSubmitting,
                                submitForm
                            } = props

                            return (
                                <Form className={classes.userDialog}>
                                    <DialogContent>
                                        <div className={['layout-column layout-align-center-center', classes.userDialogAvatarBox].join(' ')}>
                                            <div className={classes.userDialogAvatarContainer}>
                                                <img src={userDialogData.avatar} className={classes.userDialogAvatar} alt="avatar edit" />
                                            </div>
                                            <input
                                                accept="image/*"
                                                className={classes.userDialogAvatarInput}
                                                id="contained-button-file"
                                                type="file"
                                                onChange={ (e) => handleAvatarChange(e.target.files) }

                                                disabled={ userDialogAvatarLoading || isSubmitting }
                                            />
                                            <label htmlFor="contained-button-file">
                                                <Button variant="contained" color="primary" component="span" disabled={ userDialogAvatarLoading || isSubmitting } size="small" startIcon={userDialogAvatarLoading ? <CircularProgress size="1rem" /> : null}>
                                                    Change Avatar
                                                </Button>
                                            </label>
                                        </div>
                                        <Field
                                            component={ TextField }

                                            name="username"
                                            type="text"
                                            label="Username"
                                            variant="outlined"
                                            fullWidth
                                            helperText={
                                                errors.username && touched.username
                                                    ? errors.username
                                                    : 'Enter username.'
                                            }
                                            error={
                                                errors.username && touched.username
                                                    ? true
                                                    : false
                                            }
                                            onChange={ handleChange }
                                            onBlur={ handleBlur }
                                            disabled={ isSubmitting }
                                        />

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={ userDialogChangePassword }
                                                    onChange={ () => setUserDialogChangePassword(!userDialogChangePassword) }
                                                    name="passwordChanger"
                                                    inputProps={{ 'aria-label': 'Password changer switch' }}
                                                />
                                            }
                                            disabled={ isSubmitting }
                                            label="Change password?"
                                        />
                                        {
                                            userDialogChangePassword ? (
                                                <Field
                                                    component={ TextField }
                                                    name="password"
                                                    label="Password"
                                                    variant="outlined"
                                                    fullWidth
                                                    type={ userDialogPasswordShow ? 'text' : 'password'}
                                                    helperText={
                                                        errors.password && touched.password
                                                            ? errors.password
                                                            : 'Enter password.'
                                                    }
                                                    error={
                                                        errors.password && touched.password
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={ handleChange }
                                                    onBlur={ handleBlur }
                                                    disabled={ isSubmitting }

                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={() => setUserDialogPasswordShow(!userDialogPasswordShow)}
                                                                >
                                                                    {userDialogPasswordShow ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            ) : null
                                        }
                                    </DialogContent>
                                    
                                    <DialogActions>
                                        <div className={['layout-row layout-align-center-center'].join(' ')}>
                                            <Button onClick={ handleDialogClose } color="primary">
                                                Cancel
                                            </Button>
                                            <Button
                                                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                disabled={ isSubmitting }
                                                onClick={ submitForm }
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </DialogActions>
                                    
                                </Form>
                            )
                        }
                    }
                </Formik>
            </Dialog>
        
            {/* Dialog Confirm */}
            {/* <DialogConfirmComponent open={dialogConfirm} confirmMessage={dialogConfirmMessage} closeCallback={dialogConfirmCallback} /> */}
            <Dialog
                open={dialogConfirm}
                onClose={() => handleDeleteConfirm(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{dialogConfirmMessage}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => handleDeleteConfirm(false)} color="primary">
                        No
                    </Button>
                    <Button onClick={() => handleDeleteConfirm(true)} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Message */}
            <SnackbarMessage open={snackBarOpen} message={snackBarMessage} handleClose={handleSnackbarMessage} />
        </Fragment>
    )
}

export default AdminUserComponent

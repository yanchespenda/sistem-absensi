import React, { Fragment, useEffect, useState } from "react"
import axios from "axios"
import useSWR from "swr"
import { Formik, Form, Field, FormikProps } from 'formik'
import * as yup from "yup"
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, makeStyles, Theme, createStyles, TablePagination, Toolbar, IconButton, Typography, LinearProgress, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, CircularProgress } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add'
// import DeleteIcon from '@material-ui/icons/Delete'
// import RefreshIcon from '@material-ui/icons/Refresh'
// import EditIcon from '@material-ui/icons/Edit'

interface tableData {
    no: number
    id: number
    username: string
    lastAttendAt: string | null
}

function createData(no: number, id: number, username: string, lastAttendAt: string | null): tableData {
    return { no, id, username, lastAttendAt }
}

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
    password?: string
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
            width: '70%',
        },
        headRowCellLastAttended: {
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

    const { data } = useSWR<SWRData>(`api/admin/user?perPage=${rowsPerPage}&page=${page}`)

    // if (data) {
    //     console.log('data', data)
    // }
    
    useEffect(() => {
        titleHandler('User Management')
    }, [titleHandler])

    const handleDialogClose = () => {
        setUserDialogOpen(false)
    }
    const handleDialogOpen = (id: number) => {
        setUserDialogLoading(true)
        setUserDialogId(id)
        axios.get<UserDialogData>(`/api/admin/user/${id}/edit`).then(res => {
            setUserDialogData(res.data)
            setUserDialogOpen(true)
        }).catch(err => {
            console.log('err', err)
        }).then( () => {
            setUserDialogLoading(false)
        })
    }

    const handleDialogSave = (data: InterfaceUserForm, resetForm: Function, isLoading: Function) => {

    }

    const handleChangePage = (_event: unknown, newPage: number) => {
        console.log('handleChangePage', newPage)
        setPage(newPage)
    }
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handleChangeRowsPerPage', event.target.value)
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
            }).catch(err => {
                console.log('err', err)
            }).then( () => {
                setUserDialogAvatarLoading(false)
            })
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
                                // className={classes.menuButton}
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
                                        <TableCell className={classes.headRowCellLastAttended} align="right">Last attended</TableCell>
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
                                                            <Typography variant="caption" component="span" onClick={() => handleDialogOpen(row.id)}>Edit</Typography>
                                                            {'\u00A0|\u00A0'}
                                                            <Typography variant="caption" component="span">Delete</Typography>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right">
                                                    {
                                                        row.lastAttendAt === null ? 'None' : row.lastAttendAt
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={data?.config.totalItems || 0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
            </div>
            
            {/* Edit User Dialog */}
            <Dialog open={userDialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit user</DialogTitle>
                <Formik 
                    initialValues={{
                        username: userDialogData.username,
                    }}
                    validationSchema={yup.object().shape({
                        username: yup.string()
                            .required('Username required'),
                    })}
                    onSubmit={(values: InterfaceUserForm, { resetForm, setSubmitting}) => {
                        // handleDialogSave(values, resetForm, setSubmitting)
                    }}
                >
                    {
                        (props: FormikProps<InterfaceUserForm>) => {
                            const {
                                values,
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
                                                <img src={userDialogData.avatar} className={classes.userDialogAvatar} />
                                            </div>
                                            <input
                                                accept="image/*"
                                                className={classes.userDialogAvatarInput}
                                                id="contained-button-file"
                                                type="file"
                                                onChange={ (e) => handleAvatarChange(e.target.files) }
                                            />
                                            <label htmlFor="contained-button-file">
                                                <Button variant="contained" color="primary" component="span" disabled={ userDialogAvatarLoading } size="small" startIcon={userDialogAvatarLoading ? <CircularProgress size="1rem" /> : null}>
                                                    Change Avatar
                                                </Button>
                                            </label>
                                        </div>
                                        <Field
                                            component={ TextField }
                                            name="Username"
                                            label="Username"
                                            variant="outlined"
                                            fullWidth
                                            id="username"
                                            value={values.username || ''}
                                            type="text"
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
        </Fragment>
    )
}

export default AdminUserComponent

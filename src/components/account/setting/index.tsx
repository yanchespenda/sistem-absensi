import React, { Fragment, useEffect, useState } from "react"
import { Typography, InputAdornment, IconButton, Card, CardContent, makeStyles, Theme, createStyles, Button, CircularProgress, Snackbar } from "@material-ui/core"
import { Formik, Form, Field, FormikProps } from 'formik'
import { TextField } from 'formik-material-ui'
import * as yup from "yup"
import axios from "axios"

import CloseIcon from '@material-ui/icons/Close'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'

interface IProps {
    titleHandler: (title: string) => void
}

interface InterfaceUserForm {
    passwordOld: string
    passwordNew: string
    passwordNewRepeat: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        marginForm: {
            marginTop: theme.spacing(1),
        },
        marginInput: {
            marginTop: theme.spacing(2),
        }
    })
)

const AccountSettingComponent = ({titleHandler}: IProps) => {
    const classes = useStyles()

    const [userDialogPasswordShow, setUserDialogPasswordShow] = useState(false)
    const [passwordCardLoading, setPasswordCardLoading] = useState(false)
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [snackBarMessage, setSnackBarMessage] = useState('')

    useEffect(() => {
        titleHandler('Setting account')
    }, [titleHandler])

    const passwordChangeHandle = (data: InterfaceUserForm, resetForm: Function, isLoading: Function) => {
        if (passwordCardLoading) return
        setPasswordCardLoading(true)
        const formData = new FormData()
        formData.append('passwordOld', data.passwordOld)
        formData.append('passwordNew', data.passwordNew)
        formData.append('passwordNewRepeat', data.passwordNewRepeat)
        axios.post(`/api/user/setting/password`, formData).then(res => {
            resetForm({})
            setSnackBarOpen(true)
            setSnackBarMessage(res.data?.message || 'Ok')
        }).catch(err => {
            setSnackBarOpen(true)
            setSnackBarMessage(err.response?.data?.message || 'Something went wrong')
            console.log('err', err)
        }).then( () => {
            isLoading(false)
            setPasswordCardLoading(false)
        })
    }

    const snackbarHandle = () => {
        setSnackBarOpen(!snackBarOpen)
    }

    return (
        <Fragment>
            <div className="sectionContainer">
                <div className="container">
                    <Card>
                        <CardContent>
                            <Typography variant="h5">
                                Change password
                            </Typography>
                            <Formik 
                                initialValues={{
                                    passwordOld: '',
                                    passwordNew: '',
                                    passwordNewRepeat: ''
                                }}
                                validationSchema={yup.object().shape({
                                    passwordOld: yup.string()
                                        .required('Current password required'),
                                    passwordNew: yup.string().required('New password required').min(6, 'To short').max(25, 'To long'),
                                    passwordNewRepeat: yup.string().required('Repeat password required').oneOf([yup.ref('passwordNew'), ''], 'Password must match')
                                })}
                                onSubmit={(values: InterfaceUserForm, { resetForm, setSubmitting}) => {
                                    passwordChangeHandle(values, resetForm, setSubmitting)
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
                                        <Form className={classes.marginForm}>
                                            <Field
                                                component={ TextField }
                                                name="passwordOld"
                                                label="Current password"
                                                variant="outlined"
                                                fullWidth
                                                type={ userDialogPasswordShow ? 'text' : 'password'}
                                                helperText={
                                                    errors.passwordOld && touched.passwordOld
                                                        ? errors.passwordOld
                                                        : 'Enter password.'
                                                }
                                                error={
                                                    errors.passwordOld && touched.passwordOld
                                                        ? true
                                                        : false
                                                }
                                                onChange={ handleChange }
                                                onBlur={ handleBlur }
                                                disabled={ isSubmitting }
                                                className={classes.marginInput}

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

                                            <Field
                                                component={ TextField }
                                                name="passwordNew"
                                                label="Current password"
                                                variant="outlined"
                                                fullWidth
                                                type={ userDialogPasswordShow ? 'text' : 'password'}
                                                helperText={
                                                    errors.passwordNew && touched.passwordNew
                                                        ? errors.passwordNew
                                                        : 'Enter password.'
                                                }
                                                error={
                                                    errors.passwordNew && touched.passwordNew
                                                        ? true
                                                        : false
                                                }
                                                onChange={ handleChange }
                                                onBlur={ handleBlur }
                                                disabled={ isSubmitting }
                                                className={classes.marginInput}

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

                                            <Field
                                                component={ TextField }
                                                name="passwordNewRepeat"
                                                label="Current password"
                                                variant="outlined"
                                                fullWidth
                                                type={ userDialogPasswordShow ? 'text' : 'password'}
                                                helperText={
                                                    errors.passwordNewRepeat && touched.passwordNewRepeat
                                                        ? errors.passwordNewRepeat
                                                        : 'Enter password.'
                                                }
                                                error={
                                                    errors.passwordNewRepeat && touched.passwordNewRepeat
                                                        ? true
                                                        : false
                                                }
                                                onChange={ handleChange }
                                                onBlur={ handleBlur }
                                                disabled={ isSubmitting }
                                                className={classes.marginInput}

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

                                            <div className={['layout-row layout-align-center-center'].join(' ')}>
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
                                        </Form>
                                    )
                                }
                            }
                            </Formik>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={ snackBarOpen }
                autoHideDuration={6000}
                onClose={ snackbarHandle }
                message={ snackBarMessage }
                action={
                <Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={ snackbarHandle }>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Fragment>
                }
            />
        </Fragment>
    )
}

export default AccountSettingComponent

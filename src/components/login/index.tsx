import React, { Fragment, useState } from 'react'
import { Formik, Form, Field, FormikProps } from 'formik'
import * as yup from "yup"
import axios from "axios"
import { setStorageItem } from '../../helper/localStorage'
import { Grid, Container, Card, CardContent, Typography, Button, CircularProgress, TextField, IconButton, Snackbar } from '@material-ui/core'
// import { connect } from 'react-redux'
// import { signInUser } from '../../redux/actions/useActions'

import CloseIcon from '@material-ui/icons/Close'

import MainStyle from './style.module.scss'


interface InterfaceForm {
    username: string
    password: string
}

/* interface IResAction {
    enable: boolean
    link: string
} */

function LoginComponent() {
    const [IsLoading, setIsLoading] = useState(false)
    const [OpenSnackbar, setOpenSnackbar] = useState(false)
    const [SnackbarMessage, setSnackbarMessage] = useState('')

    const runSignin = (data: InterfaceForm, resetForm: Function, isLoading: Function) => {
        if (!IsLoading) {
            setIsLoading(true)

            // signInUser({
            //     data,
            //     isLoading,
            //     resetForm,
            //     setIsLoading,
            //     setOpenSnackbar,
            //     setSnackbarMessage
            // }, null)

            const params = new URLSearchParams()
            params.append('username', data.username)
            params.append('password', data.password)

            axios.post('auth/signin', params)
                .then( (res) => {
                    const token = `${res.data.token}`
                    setStorageItem('token', token)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                    console.log('response', res)

                    resetForm({})
                    window.location.reload()
                })
                .catch( (err) => {
                    console.log(err)

                    setSnackbarMessage('Sorry, something went wrong')
                    if (err.response) {
                        if (err.response.data?.message) {
                            setSnackbarMessage(err.response.data.message)
                        }
                    }
                    setOpenSnackbar(true)
                })
                .then( () => {
                    isLoading(false)
                    setIsLoading(false)
                })

        }
    }

    const snackbarHandle = () => {
        setOpenSnackbar(!OpenSnackbar)
    }

    return (
        <Fragment>
            <Grid container justify="center">
                <Container maxWidth="sm">
                    <div className={MainStyle.authContainer}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Attendance Signin
                                </Typography>
                                <Formik 
                                    initialValues={{
                                        username: '',
                                        password: ''
                                    }}
                                    validationSchema={yup.object().shape({
                                        username: yup.string()
                                            .required('Username required'),
                                        password: yup.string()
                                            .required('Password required')
                                    })}
                                    onSubmit={(values: InterfaceForm, { resetForm, setSubmitting}) => {
                                        runSignin(values, resetForm, setSubmitting)
                                    }}
                                >
                                    {
                                        (props: FormikProps<InterfaceForm>) => {
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
                                                <Form className={[MainStyle.formIndex].join(' ')}>
                                                    <Field
                                                        className={MainStyle.marginInput}
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
                                                    <Field
                                                        className={MainStyle.marginInput}
                                                        component={ TextField }
                                                        name="Password"
                                                        label="Password"
                                                        variant="outlined"
                                                        fullWidth
                                                        id="password"
                                                        value={values.password || ''}
                                                        type="password"
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
                                                    />
                                                    <div className={[MainStyle.formAction, 'layout-row layout-align-center-center'].join(' ')}>
                                                        <Button
                                                            startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                                            variant="contained"
                                                            color="primary"
                                                            type="submit"
                                                            disabled={ isSubmitting }
                                                            onClick={ submitForm }
                                                            
                                                        >
                                                            Signin
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
                </Container>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={ OpenSnackbar }
                    autoHideDuration={6000}
                    onClose={ snackbarHandle }
                    message={ SnackbarMessage }
                    action={
                    <Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={ snackbarHandle }>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Fragment>
                    }
                />
            </Grid>
        </Fragment>
    )
}

//this map the states to our props in this functional component
// const mapStateToProps = (state: any) => ({
//     user: state.user,
//     UI: state.UI
// })

//this map actions to our props in this functional component
// const mapActionsToProps = {
    // signInUser
// }

// export default connect(mapStateToProps, mapActionsToProps)(LoginComponent)

export default LoginComponent
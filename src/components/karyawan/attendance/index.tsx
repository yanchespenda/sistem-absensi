import React, { Fragment, useEffect, useState } from "react"
import { Card, Fab, makeStyles, Theme, createStyles, CardContent, Typography, CardActions, Button, Stepper, Step, StepLabel, StepContent, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, IconButton } from "@material-ui/core"
import Webcam from "react-webcam"
import axios from "axios"

import CloseIcon from '@material-ui/icons/Close'
import CameraIcon from '@material-ui/icons/Camera'

import MainStyle from './style.module.scss'
import useSWR from "swr"
import { TimeLocal } from "../../../helper/dateTime"
import OtherVerifyComponent from "../../other/verify"
import { Redirect } from "react-router-dom"

interface IProps {
    titleHandler: (title: string) => void
}

interface UserStatus {
    found: boolean
    wasIn: boolean
    wasOut: boolean
    dateIn: string | null
    dateOut: string | null

    dateInEarly: boolean
    dateInLate: boolean
    dateOutEarly: boolean
    dateOutLate: boolean

    dateInEarlyText: string | null
    dateInLateText: string | null
    dateOutEarlyText: string | null
    dateOutLateText: string | null
}

interface SWRData {
    attendAvailable: boolean
    userStatus: UserStatus
}

interface AttedanceCheck {
    available: boolean
    isEarly: boolean
    isLate: boolean
    infoMin: string | null
    infoMax: string | null
    onNow: string | null
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            margin: theme.spacing(1),
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
        actionsContainer: {
            marginBottom: theme.spacing(2),
        },
        actionsButton: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        resetContainer: {
            padding: theme.spacing(3),
        },
        steper2Info: {
            marginTop: theme.spacing(1),
        },

        // background: rgba(0,0,0,.5);right: 0;bottom: 0;left: 0;z-index: 1;cursor: crosshair;
        camOverlay: {
            background: 'rgba(0,0,0,.5)',
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1,
            cursor: 'crosshair',
            position: 'absolute',
            top: 0,
            userSelect: 'none',
            boxSizing: 'border-box',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            marginBottom: '8px'
        },
        camRegion: {
            position: 'absolute',
            top: 0,
            userSelect: 'none',
            boxSizing: 'border-box',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitBoxSizing: 'border-box',
            MozBoxSizing: 'border-box',
            marginBottom: '8px',
            border: '1px dashed red',
            zIndex: 3,
            cursor: 'move',
            transform: 'translate(0px, 0px)',
            width: '450px',
            height: '450px',
        }
    }),
)

const KaryawanAttendanceComponent = ({titleHandler}: IProps) => {
    const classes = useStyles()
    const webcamRef = React.useRef<any>(null)
    const [attedanceIn, setAttedanceIn] = useState(false)
    const [attedanceOut, setAttedanceOut] = useState(false)
    const [attedanceInActiveStep, setAttedanceInActiveStep] = useState(0)
    const [attedanceSteperLoading, setAttedanceSteperLoading] = useState(false)
    const [attedanceSteperNextDisabled, setAttedanceSteperNextDisabled] = useState(false)
    const [attedanceCheck, setAttedanceCheck] = useState<AttedanceCheck>({
        available: false,
        isEarly: false,
        isLate: false,
        infoMax: null,
        infoMin: null,
        onNow: null
    })
    const [attedanceLoading, setAttedanceLoading] = useState(false)
    const [attedancePhoto, setAttedancePhoto] = useState<any>(null)
    const [openDialogConfirm, setOpenDialogConfirm] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackBarMessage, setSnackBarMessage] = useState('')

    const { data, revalidate } = useSWR<SWRData>('/api/karyawan/status')

    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef?.current?.getScreenshot() || null

          console.log('imageSrc', imageSrc)
          setAttedancePhoto(imageSrc)
          setAttedanceSteperNextDisabled(false)
        },
        [webcamRef, setAttedancePhoto]
    )

    const [permissionFailed, setPermissionFailed] = useState(false)
    useEffect(() => {
        titleHandler('Attedance')

        axios.get<any>(`/api/karyawan/permission`).then(() => { }).catch(() => {
            setPermissionFailed(true)
        }).then( () => { })
    }, [titleHandler])

    if (permissionFailed) {
        return <Redirect to="/" />
    }

    const handleNext = () => {
        const prevStep = attedanceInActiveStep
        if (prevStep === 2 ) {
            handleAttedanceIn()
            return ''
        }
        setAttedanceInActiveStep((prevActiveStep) => prevActiveStep + 1)
        if (prevStep === 0 ) {
            setAttedanceSteperNextDisabled(true)
        }
    }
    
    const handleBack = () => {
        const prevStep = attedanceInActiveStep
        setAttedanceInActiveStep((prevActiveStep) => prevActiveStep - 1)
        if (prevStep === 1) {
            checkAttedanceIn()
            setAttedanceSteperNextDisabled(false)
        } else if (prevStep === 2) {
            setAttedanceSteperNextDisabled(true)
            setAttedancePhoto(null)
        }
    }
    
    // const handleReset = () => {
    //     checkAttedanceIn()
    //     setAttedanceInActiveStep(0)
    // }

    const handleAttedanceIn = (cofirm?: boolean) => {
        if (!cofirm) {
            setDialogMessage('Are you sure to attended in?')
            setOpenDialogConfirm(true)
            return 
        }

        setAttedanceLoading(true)
        const params = new URLSearchParams()
        if (attedancePhoto)
            params.append('face', attedancePhoto)
        // params.append('password', data.password)
        axios.post('api/karyawan/attedance/in', params).then(res => {
            setOpenSnackbar(true)
            setSnackBarMessage(res.data?.message || 'Ok')
            // console.log('res', res)
            
            // setAttedanceInActiveStep((prevActiveStep) => prevActiveStep + 1)
            setAttedanceIn(false)
        }).catch(err => {
            setOpenSnackbar(true)
            setSnackBarMessage(err.response?.data?.message || 'Something went wrong')
            // console.log('err', err)
        }).then(() => {
            revalidate()
            setOpenDialogConfirm(false)
            setAttedanceLoading(false)
        })
    }

    const handleAttedanceOut = (cofirm?: boolean) => {
        if (!cofirm) {
            setDialogMessage('Are you sure to attended out?')
            setOpenDialogConfirm(true)
            return 
        }

        setAttedanceLoading(true)
        axios.post('api/karyawan/attedance/out').then(res => {
            setOpenSnackbar(true)
            setSnackBarMessage(res.data?.message || 'Ok')
            // console.log('res', res)
        }).catch(err => {
            setOpenSnackbar(true)
            setSnackBarMessage(err.response?.data?.message || 'Something went wrong')
            // console.log('err', err)
        }).then(() => {
            revalidate()
            setOpenDialogConfirm(false)
            setAttedanceOut(false)
            setAttedanceLoading(false)
        })
    }

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    }

    const getSteper = () => ['Info attedance', 'Take a photo', 'Check & submit']

    const checkAttedanceIn = () => {
        setAttedanceSteperLoading(true)
        axios.get<AttedanceCheck>('/api/karyawan/attedance/in/check').then(res => {
            setAttedanceCheck(res.data)
            // console.log('res', res)
        }).catch(err => {
            console.log('err', err)
        }).then(() => {
            setAttedanceSteperLoading(false)
        })
    }

    const attedanceInRun = () => {
        if (!attedanceIn) {
            checkAttedanceIn()
        }
        setAttedanceIn(!attedanceIn)
    }

    const attedanceOutRun = () => {
        if (!attedanceOut) {
            handleAttedanceOut()
        }
        setAttedanceOut(!attedanceOut)
    }

    const getSteperContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <div className="layout-column">
                        <Typography variant="h4">
                            Note: Make sure your face at center of area
                        </Typography>
                        <Typography>
                            Attedance In Status: { attedanceCheck.available ? 'Available' : 'Unavailable' }
                        </Typography>
                        <Typography>
                            Range attedance: { `${attedanceCheck.infoMin ? TimeLocal(attedanceCheck.infoMin) : ''} - ${attedanceCheck.infoMax ? TimeLocal(attedanceCheck.infoMax) : ''}` }
                        </Typography>
                        <Typography>
                            Current time: { `${attedanceCheck.onNow ? TimeLocal(attedanceCheck.onNow) : ''}` }
                        </Typography>
                        <Typography>
                            Info attedance: { `${attedanceCheck.isEarly ? 'To early' : ''}${attedanceCheck.isLate ? 'To late' : ''}` }
                        </Typography>
                    </div>
                )
            case 1:
                return (
                    <div className={MainStyle.mainCamContainer}>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                        />

                        {/* <div className={classes.camRegion}></div> */}
                        {/* <div className={classes.camOverlay}></div> */}

                        <div className={[MainStyle.actionContainer, 'layout-row layout-align-center-center'].join(' ')}>
                            <div className={MainStyle.action}>
                                <Fab
                                    variant="extended"
                                    size="medium"
                                    color="primary"
                                    aria-label="add"
                                    className={classes.margin}
                                    onClick={capture}
                                >
                                    <CameraIcon className={classes.extendedIcon} />
                                    Capture
                                </Fab>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="layout-column">
                        {
                            attedancePhoto ? (<img src={attedancePhoto} alt="current face" />) : null
                        }
                        <Typography className={classes.steper2Info}>
                            Attedance time: { `${attedanceCheck.onNow ? TimeLocal(attedanceCheck.onNow) : ''}${attedanceCheck.isEarly ? ' [to early]' : ''}${attedanceCheck.isLate ? ' [to late]' : ''}` }
                        </Typography>
                    </div>
                )
            default:
                return 'Unknown step'
        }
    }

    const handleDialogClose = () => {
        if (attedanceIn) {
            handleAttedanceIn(true)
        }
        if (attedanceOut) {
            handleAttedanceOut(true)
        }
    }

    const snackbarHandle = () => {
        setOpenSnackbar(false)
    }

    return (
        <Fragment>
            <div className="sectionContainer">
                <div className="container">
                    <div className={['layout-column layout-align-center-center'].join(' ')}>
                        {
                            data ? (
                                <Fragment>
                                    <div className={[MainStyle.fullWidth, MainStyle.statusContainer].join(' ')}>
                                        <Card className="flex">
                                            <CardContent>
                                                <Typography variant="h5" component="h2" gutterBottom>
                                                    Status attended [{ data.attendAvailable ? 'Online' : 'Offline' }]
                                                </Typography>
                                                <Typography color="textSecondary">
                                                    Today attended stats: { data.userStatus.found ? 'allready attend' : 'not yet' }
                                                </Typography>
                                                <Typography color="textSecondary">
                                                    Today attended in: { data.userStatus.wasIn ? `done
                                                        ${ data.userStatus.dateIn ? ` • ${TimeLocal(data.userStatus.dateIn)}${data.userStatus.dateInEarly ? ` [${data.userStatus.dateInEarly} early]` : ''}${data.userStatus.dateInLate ? ` [${data.userStatus.dateInLateText} late]` : ''}` : '' }`
                                                    : 'no' 
                                                    }
                                                </Typography>
                                                <Typography color="textSecondary">
                                                    Today attended out: { data.userStatus.wasOut ? `done
                                                        ${ data.userStatus.dateOut ? ` • ${TimeLocal(data.userStatus.dateOut)}${data.userStatus.dateOutEarly ? ` [${data.userStatus.dateOutEarly} early]` : ''}${data.userStatus.dateOutLate ? ` [${data.userStatus.dateOutLateText} late]` : ''}` : '' }`
                                                    : 'no' 
                                                    }
                                                </Typography>
                                            </CardContent>
                                            {
                                                data.attendAvailable || (data.userStatus.wasIn && !data.userStatus.wasOut) ? (
                                                    <CardActions>
                                                        {
                                                            !data.userStatus.wasIn ? (
                                                                <Button size="small" onClick={attedanceInRun}>Attend in</Button>
                                                            ) : null
                                                        }
                                                        {
                                                            data.userStatus.wasIn && !data.userStatus.wasOut ? (
                                                                <Button size="small" onClick={attedanceOutRun}>Attend out</Button>
                                                            ) : null
                                                        }
                                                    </CardActions>
                                                ) : null
                                            }
                                        </Card>
                                    </div>
                                </Fragment>
                            ) : null
                        }

                        {
                            attedanceIn ? (
                                <Fragment>
                                    <div className={[MainStyle.fullWidth, MainStyle.statusContainer].join(' ')}>
                                        <Stepper activeStep={attedanceInActiveStep} orientation="vertical">
                                            {
                                                getSteper().map((label, idx) => {

                                                    return (
                                                        <Step key={label}>
                                                            <StepLabel>{label}</StepLabel>
                                                            <StepContent>
                                                                { getSteperContent(idx) }
                                                                <div className={classes.actionsContainer}>
                                                                    <div>
                                                                        {
                                                                            attedanceInActiveStep > 0 ? (
                                                                                <Button
                                                                                    onClick={handleBack}
                                                                                    className={classes.actionsButton}
                                                                                >
                                                                                    Back
                                                                                </Button>
                                                                            ) : null
                                                                        }
                                                                        <Button
                                                                            variant="contained"
                                                                            color="primary"
                                                                            onClick={handleNext}
                                                                            className={classes.actionsButton}
                                                                            disabled={attedanceSteperNextDisabled || attedanceSteperLoading}
                                                                        >
                                                                            {attedanceInActiveStep === getSteper().length - 1 ? 'Finish' : 'Next'}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </StepContent>
                                                        </Step>
                                                    )
                                                })
                                            }
                                        </Stepper>
                                        {attedanceInActiveStep === getSteper().length && (
                                            <Paper square elevation={0} className={classes.resetContainer}>
                                                <Typography>Attend in finished</Typography>
                                            </Paper>
                                        )}
                                    </div>
                                </Fragment>
                            ) : null
                        }
                        
                        {
                            attedanceOut ? (
                                <Fragment>
                                    
                                </Fragment>
                            ) : null
                        }
                    </div>
                    
                </div>
            </div>

            <Dialog
                open={openDialogConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{dialogMessage}</DialogTitle>
                {
                    attedanceLoading ? (
                        <DialogContent>
                            <OtherVerifyComponent />
                        </DialogContent>
                    ) : null
                }
                <DialogActions>
                    <Button onClick={() => setOpenDialogConfirm(false)} disabled={attedanceLoading} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDialogClose} color="primary" disabled={attedanceLoading} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={ openSnackbar }
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

export default KaryawanAttendanceComponent

import React, { Fragment, useEffect, useState } from "react"
import { Card, Fab, makeStyles, Theme, createStyles, CardContent, Typography, CardActions, Button, Stepper, Step, StepLabel, StepContent, Paper } from "@material-ui/core"
import Webcam from "../../../helper/react-webcam"
import axios from "axios"

import CameraIcon from '@material-ui/icons/Camera'

import MainStyle from './style.module.scss'
import useSWR from "swr"
import { TimeLocal } from "../../../helper/dateTime"

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
        }
    }),
)

const KaryawanAttendanceComponent = ({titleHandler}: IProps) => {
    const classes = useStyles()
    const webcamRef = React.useRef<any>(null)
    // const [initLoading, setInitLoading] = useState(false)
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
    const [attedancePhoto, setAttedancePhoto] = useState<string | null>(null)

    const handleNext = () => {
        const prevStep = attedanceInActiveStep
        setAttedanceInActiveStep((prevActiveStep) => prevActiveStep + 1)
        if (prevStep === 0 ) {
            setAttedanceSteperNextDisabled(true)
        }
        if (prevStep === 2 ) {
            handleAttedanceIn()
        }
    }
    
    const handleBack = () => {
        const prevStep = attedanceInActiveStep
        setAttedanceInActiveStep((prevActiveStep) => prevActiveStep - 1)
        if (prevStep === 1) {
            checkAttedanceIn()
            setAttedanceSteperNextDisabled(false)
        } else  if (prevStep === 2) {
            setAttedanceSteperNextDisabled(true)
            setAttedancePhoto(null)
        }
    }
    
    const handleReset = () => {
        checkAttedanceIn()
        setAttedanceInActiveStep(0)
    }

    const handleAttedanceIn = () => {
        const params = new URLSearchParams()
        if (attedancePhoto)
            params.append('face', attedancePhoto)
        // params.append('password', data.password)
        axios.post('api/karyawan/attedance/in', params).then(res => {
            console.log('res', res)
        }).catch(err => {
            console.log('err', err)
        }).then(() => {
            setAttedanceIn(false)
        })
    }

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    }

    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef?.current?.getScreenshot() || null

          console.log('imageSrc', imageSrc)
          setAttedancePhoto(imageSrc)
          setAttedanceSteperNextDisabled(false)
        },
        [webcamRef]
    )

    const { data } = useSWR<SWRData>('/api/karyawan/status')

    const getSteper = () => ['Info attedance', 'Take a photo', 'Check & submit']

    const checkAttedanceIn = () => {
        setAttedanceSteperLoading(true)
        axios.get<AttedanceCheck>('/api/karyawan/attedance/in/check').then(res => {
            setAttedanceCheck(res.data)
            console.log('res', res)
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
        setAttedanceOut(!attedanceOut)
    }

    const getSteperContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <div className="layout-column">
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
                            screenshotFormat="image/webp"
                            videoConstraints={videoConstraints}
                        />

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
                            attedancePhoto ? (<img src={attedancePhoto} />) : null
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

    useEffect(() => {
        titleHandler('Attedance')
    }, [titleHandler])

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
                                                data.attendAvailable ? (
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
        </Fragment>
    )
}

export default KaryawanAttendanceComponent

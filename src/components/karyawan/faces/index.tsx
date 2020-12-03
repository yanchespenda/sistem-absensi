import React, { Fragment, useEffect, useState } from "react"
import { makeStyles, Theme, createStyles, Paper, Toolbar, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Dialog, DialogTitle, DialogActions, Button, Snackbar, Fab, Stepper, Step, StepLabel, StepContent } from "@material-ui/core"
import axios from "axios"
import Webcam from "react-webcam"
import useSWR from "swr"
import { TimeLocal } from "../../../helper/dateTime"

import MainStyle from './style.module.scss'

import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import CameraIcon from '@material-ui/icons/Camera'
import { Redirect } from "react-router-dom"

interface IProps {
    titleHandler: (title: string) => void
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

        imgFaceContainer: {
            width: '200px',
            height: '200px'
        },
        imgFace: {
            width: '100%',
            height: '100%'
        },


        dialogConfirm: {
            width: '400px'
        },

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

    }),
)

interface FaceResponse {
    id: number
    face: string
    active: boolean
    createdAt: string
}

const KaryawanFacesComponent = ({titleHandler}: IProps) => {
    const classes = useStyles()
    const webcamRef = React.useRef<any>(null)
    const [dialogConfirm, setDialogConfirm] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [dialogType, setDialogType] = useState(0)
    const [dialogId, setDialogId] = useState(0)
    const [dialogProgress, setDialogProgress] = useState(false)
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [snackBarMessage, setSnackBarMessage] = useState('')
    const [openNewFace, setOpenNewFace] = useState(false)
    const [currentFace, setCurrentFace] = useState<any>(null)
    const [currentFaceStep, setCurrentFaceStep] = useState(0)
    const [currentFaceNextDisabled, setCurrentFaceNextDisabled] = useState(false)
    const [currentFaceLoading, setCurrentFaceLoading] = useState(false)
    const { data, revalidate } = useSWR<FaceResponse[]>('/api/karyawan/face')
    const [permissionFailed, setPermissionFailed] = useState(false)

    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef?.current?.getScreenshot() || null
          setCurrentFace(imageSrc)
          setCurrentFaceNextDisabled(false)
        },
        [webcamRef, setCurrentFace]
    )

    useEffect(() => {
        titleHandler('Setting Faces')

        axios.get<any>(`/api/karyawan/permission`).then(() => { }).catch(() => {
            setPermissionFailed(true)
        }).then( () => { })
    }, [titleHandler])

    if (permissionFailed) {
        return <Redirect to="/" />
    }

    const handleDialogStatus = (id: number, currentStatus: boolean) => {
        setDialogId(id)
        setDialogType(1)
        if (currentStatus) {
            setDialogMessage('Deativate face?')
        } else {
            setDialogMessage('Activate face?')
        }
        setDialogConfirm(true)
    }

    const handleDialogDelete = (id: number) => {
        setDialogId(id)
        setDialogType(2)
        setDialogMessage('Are you sure want to delete this face?')
        setDialogConfirm(true)
    }

    const handleDialogConfirmClose = () => {
        setDialogType(0)
        setDialogConfirm(false)
    }

    const handleDialogConfirmYes = () => {
        if (dialogProgress) return 
        if (dialogType === 1) {
            setDialogProgress(true)
            axios.post(`api/karyawan/face/${dialogId}/status`).then(res => {
                setSnackBarOpen(true)
                setSnackBarMessage(res.data?.message || 'Success')
            }).catch(err => {
                setSnackBarOpen(true)
                setSnackBarMessage(err.response?.data?.message || 'Something went wrong')
            }).then(() => {
                revalidate()
                handleDialogConfirmClose()
                setDialogProgress(false)
            })
        } else if (dialogType === 2) {
            setDialogProgress(true)
            axios.post(`api/karyawan/face/${dialogId}/delete`).then(res => {
                setSnackBarOpen(true)
                setSnackBarMessage(res.data?.message || 'Success')
            }).catch(err => {
                setSnackBarOpen(true)
                setSnackBarMessage(err.response?.data?.message || 'Something went wrong')
            }).then(() => {
                revalidate()
                handleDialogConfirmClose()
                setDialogProgress(false)
            })
        }
    }

    const handleSnackBar = () => {
        setSnackBarOpen(false)
        setSnackBarMessage('')
    }

    const handleNewFace = () => {
        stepHandleReset()
        setOpenNewFace(!openNewFace)
    }

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    }

    const getSteper = () => ['Notice', 'Take a photo', 'Check & save']

    const getSteperContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <div className="layout-column">
                        <Typography variant="h4">
                            Note: Make sure your face at center of area
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
                            currentFace ? (<img src={currentFace} alt="current face" />) : null
                        }
                        <Typography className={classes.steper2Info}>
                           
                        </Typography>
                    </div>
                )
            default:
                return 'Unknown step'
        }
    }

    const handleFaceSubmit = () => {
        if (currentFaceLoading) return
        setCurrentFaceLoading(true)
        const params = new URLSearchParams()
        if (currentFace)
            params.append('face', currentFace)
        axios.post('api/karyawan/face/new', params).then(res => {
            setSnackBarOpen(true)
            setSnackBarMessage(res.data?.message || 'Ok')
            // console.log('res', res)
            setOpenNewFace(false)
        }).catch(err => {
            setSnackBarOpen(true)
            setSnackBarMessage(err.response?.data?.message || 'Something went wrong')
            // console.log('err', err)
        }).then(() => {
            revalidate()
            setCurrentFaceLoading(false)
        })
    }

    const stepHandleNext = () => {
        const prevStep = currentFaceStep
        setCurrentFaceStep((prevActiveStep) => prevActiveStep + 1)
        if (prevStep === 0 ) {
            setCurrentFaceNextDisabled(true)
        } else if (prevStep === 2) {
            setCurrentFaceStep(prevStep)
            handleFaceSubmit()
        }
    }
    const stepHandlePrev = () => {
        const prevStep = currentFaceStep
        setCurrentFaceStep((prevActiveStep) => prevActiveStep - 1)
        if (prevStep === 1 ) {
            setCurrentFaceNextDisabled(false)
        } else if (prevStep === 2 ) {
            setCurrentFaceNextDisabled(true)
        }
    }
    const stepHandleReset = () => {
        setCurrentFaceStep(0)
        setCurrentFaceNextDisabled(false)
    }

    return (
        <Fragment>
            <div className="sectionContainer">
                <div className="container">
                    {
                        openNewFace ? (
                            <div className={[MainStyle.fullWidth, MainStyle.statusContainer].join(' ')}>
                                <Stepper activeStep={currentFaceStep} orientation="vertical">
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
                                                                    currentFaceStep > 0 ? (
                                                                        <Button
                                                                            onClick={stepHandlePrev}
                                                                            className={classes.actionsButton}
                                                                        >
                                                                            Back
                                                                        </Button>
                                                                    ) : null
                                                                }
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={stepHandleNext}
                                                                    className={classes.actionsButton}
                                                                    disabled={currentFaceNextDisabled || currentFaceLoading}
                                                                >
                                                                    {currentFaceStep === getSteper().length - 1 ? 'Finish' : 'Next'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </StepContent>
                                                </Step>
                                            )
                                        })
                                    }
                                </Stepper>
                            </div>
                        ) : null
                    }
                    <Paper>
                        <Toolbar className={classes.mainToolbar}>
                            <div className="flex"></div>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="new data"
                                onClick={handleNewFace}
                            >
                                <AddIcon />
                            </IconButton>
                        </Toolbar>
                        <TableContainer className={classes.root}>
                            <Table aria-label="data table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.headRowCellNo}>No</TableCell>
                                        <TableCell className={classes.headRowCellUsername}>Face</TableCell>
                                        <TableCell className={classes.headRowCellDateTime} align="center">Status</TableCell>
                                        <TableCell className={classes.headRowCellDateTime} align="right">Added at</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data?.map((row, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell component="th" scope="row">
                                                    {row.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="layout-column">
                                                        <div className={classes.imgFaceContainer}>
                                                            <img className={classes.imgFace} src={row.face} alt={`face-${row.id}`} />
                                                        </div>
                                                        <div className="layout-row">
                                                            <Typography className="selecableContent" variant="caption" component="span" onClick={() => handleDialogStatus(row.id, row.active)}>{row.active ? 'Deactivate' : 'Activate'}</Typography>
                                                            {'\u00A0|\u00A0'}
                                                            <Typography className="selecableContent" variant="caption" component="span" onClick={() => handleDialogDelete(row.id)}>Delete</Typography>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        row.active ? 'Active' : 'Deactive'
                                                    }
                                                </TableCell>
                                                <TableCell align="right">
                                                    {
                                                        row.createdAt === null ? 'None' : TimeLocal(row.createdAt)
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
            </div>
        
            <Dialog
                open={dialogConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle className={classes.dialogConfirm} id="alert-dialog-title">{dialogMessage}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleDialogConfirmClose} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDialogConfirmYes} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={ snackBarOpen }
                autoHideDuration={6000}
                onClose={ handleSnackBar }
                message={ snackBarMessage }
                action={
                <Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={ handleSnackBar }>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Fragment>
                }
            />
        </Fragment>
    )
}

export default KaryawanFacesComponent

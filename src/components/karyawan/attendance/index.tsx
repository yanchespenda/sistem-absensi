import React, { Fragment, useEffect, useState } from "react"
import { Card, Fab, makeStyles, Theme, createStyles, CardContent, Typography } from "@material-ui/core"
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            margin: theme.spacing(1),
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
    }),
)

const KaryawanAttendanceComponent = ({titleHandler}: IProps) => {
    const classes = useStyles()
    const webcamRef = React.useRef<any>(null)
    // const [initLoading, setInitLoading] = useState(false)
    const [initCam, setInitCam] = useState(false)

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    }

    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef?.current?.getScreenshot() || null

          console.log('imageSrc', imageSrc)
        },
        [webcamRef]
    )

    const { data } = useSWR<SWRData>('/api/karyawan/status')

    // const initLoad = () => {
    //     setInitLoading(true)
    //     axios.get('/api/karyawan/status').then(res => {
    //         console.log('res', res)
    //     }).catch(err => {

    //     }).then(() => {
    //         setInitLoading(false)
    //     })
    // }

    // useEffect(() => {
    //     initLoad()
    // }, [])

    console.log('data', data)

    useEffect(() => {
        titleHandler('Attedance')
    }, [titleHandler])

    return (
        <Fragment>
            <div className="sectionContainer">
                <div className="container">
                    <div className={['layout-row layout-align-center-center'].join(' ')}>
                        {
                            data ? (
                                <Fragment>
                                    <Card className={'flex'}>
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
                                                Today attended out: { data.userStatus.wasIn ? `done
                                                    ${ data.userStatus.dateOut ? ` • ${TimeLocal(data.userStatus.dateOut)}${data.userStatus.dateOutEarly ? ` [${data.userStatus.dateOutEarly} early]` : ''}${data.userStatus.dateOutLate ? ` [${data.userStatus.dateOutLateText} late]` : ''}` : '' }`
                                                 : 'no' 
                                                }
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Fragment>
                            ) : null
                        }
                        
                        {
                            initCam ? (
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
                            ) : null
                        }
                        
                    </div>
                    
                </div>
            </div>
        </Fragment>
    )
}

export default KaryawanAttendanceComponent

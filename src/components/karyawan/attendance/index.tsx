import React, { Fragment, useEffect } from "react"
import { Paper } from "@material-ui/core"
import Webcam from "../../../helper/react-webcam"

import MainStyle from './style.module.scss'

interface IProps {
    titleHandler: (title: string) => void
}

const KaryawanAttendanceComponent = ({titleHandler}: IProps) => {
    const webcamRef = React.useRef<any>(null)

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
    
    useEffect(() => {
        titleHandler('Attedance')
    }, [titleHandler])
    
    return (
        <Fragment>
            <div className="sectionContainer">
                <div className="container">
                    <Paper className={MainStyle.mainCamContainer}>
                        <Webcam 
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/webp"
                            videoConstraints={videoConstraints}
                        />

                        <button onClick={capture}>Capture photo</button>
                    </Paper>
                </div>
            </div>
        </Fragment>
    )
}

export default KaryawanAttendanceComponent

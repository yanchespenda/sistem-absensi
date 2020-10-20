import React, { Fragment, useCallback, useEffect, useState } from "react"
import Cropper from 'react-easy-crop'
import { Card, CardContent, Typography, makeStyles, createStyles, Theme, Button, CardActions, Snackbar, IconButton } from "@material-ui/core"
import getCroppedImg from "../../../helper/cropImage"
import axios from 'axios'

import CloseIcon from '@material-ui/icons/Close'

interface IProps {
    titleHandler: (title: string) => void
}

const useStyles = makeStyles((_theme: Theme) =>
    createStyles({
        avatarContainer: {
            position: 'relative',
            height: '350px'
        },
        avatarInput: {
            display: 'none'
        }
    })
)

async function readFile(file: any) {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}

const AccountAvatarComponent = ({titleHandler}: IProps) => {
    const classes = useStyles()

    const [imageSrc, setImageSrc] = useState<any>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [OpenSnackbar, setOpenSnackbar] = useState(false)
    const [SnackbarMessage, setSnackbarMessage] = useState('')
    const [isAvatarLoading, setIsAvatarLoading] = useState(false)

    useEffect(() => {
        titleHandler('Setting avatar')
    }, [titleHandler])

    const onFileChange = async (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            let imageDataUrl = await readFile(file)
            setImageSrc(imageDataUrl)
        }
    }

    const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const saveCroppedImage = useCallback(async () => {
        if (isAvatarLoading) return 
        try {
            const croppedImage: any = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                0,
                true
            )

            const params = new URLSearchParams()
            params.append('avatar', croppedImage)


            setIsAvatarLoading(true)
            axios.post('api/user/avatar64', params)
                .then( (res) => {
                    setOpenSnackbar(true)
                    setSnackbarMessage(res.data?.message || 'Ok')
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
                    setIsAvatarLoading(false)
                })
        } catch (e) {
            console.error(e)
            setIsAvatarLoading(false)
        }
    }, [croppedAreaPixels, imageSrc, isAvatarLoading])


    const snackbarHandle = () => {
        setOpenSnackbar(false)
    }

    return (
        <Fragment>
            <div className="sectionContainer">
                <div className="container">
                    <Card>
                        <CardContent>
                            <Typography variant="h5">
                                Change avatar
                            </Typography>
                            <div className={classes.avatarContainer}>
                                <Cropper
                                    image={imageSrc}
                                    // image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1/1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                        </CardContent>
                        <CardActions>
                            <div>
                                <input
                                    accept="image/*"
                                    className={classes.avatarInput}
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    onChange={onFileChange}
                                />
                                <label htmlFor="contained-button-file">
                                    <Button variant="contained" color="primary" component="span">
                                    Upload avatar
                                    </Button>
                                </label>
                            </div>
                            <Button size="small" onClick={saveCroppedImage}>Save</Button>
                        </CardActions>
                    </Card>
                </div>
            </div>

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
        </Fragment>
    )
}

export default AccountAvatarComponent

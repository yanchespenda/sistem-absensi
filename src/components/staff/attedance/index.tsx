import { createStyles, makeStyles, Paper, Theme, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Dialog, DialogTitle, Button, DialogActions, DialogContent } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import React, { Fragment, useEffect, useState } from "react";
import useSWR from "swr";
import { ConvertHourMinuteSecond } from "../../../helper/dateTime";
import SnackbarMessage from "../../other/parts/snackbarMessage";
import moment from "moment"
import axios from "axios"
import { Link, Redirect } from "react-router-dom";

interface IProps {
    titleHandler: (title: string) => void
}

interface tableData {
    // no: number
    // id: number
    // username: string
    // lastAttendAt: string | null
    // lastLoggedAt: string | null

    id: number
    username: string
    info: string | null
    duration: string
    wasIn: boolean
    wasOut: boolean
    dateIn: string
    dateOut: string
}

interface DashboardDataKaryawanAttedanceHistory {
    date: string
    info: string | null
    duration: string
    wasIn: boolean
    wasOut: boolean
    dateIn: string
    dateOut: string
}

interface DialogDataPart {
    username: string
    id: number
}

// interface SWRDataConfig {
//     currentPage: number
//     perPage: number
//     totalItems: number
// }
// interface SWRDataItems extends tableData {
// }
// interface SWRData {
//     config: SWRDataConfig
//     items: SWRDataItems[]
// }

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
        headRowCellUsername: {
            width: '25%',
        },
        headRowCellDateInfo: {
            width: '25%',
        },
        headRowCellWorkHour: {
            width: '25%',
        },

        headRowCellDialogDate: {
            width: '20%',
        },
        headRowCellDialogDateInfo: {
            width: '25%',
        },
        headRowCellDialogWorkHour: {
            width: '30%',
        },

        // User Dialog
        userDialog: {
            width: '600px'
        },
        
    }),
)

const StaffAttedanceComponent = ({titleHandler}: IProps) => {
    const classes = useStyles()

    useEffect(() => {
        const initElement = () => {
            titleHandler('Attedance')

            setDialogDataPart({
                id: 0,
                username: ''
            })
        }
        initElement()
    }, [titleHandler])

    const [requestLoading, setRequestLoading] = useState<boolean>(false)

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const dateMin = moment().subtract(1, 'years')
    const dateMax = moment()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedDateStart, setSelectedDateStart] = useState<MaterialUiPickersDate | null>(moment().subtract(30, 'days'))
    const [selectedDateEnd, setSelectedDateEnd] = useState<MaterialUiPickersDate | null>(dateMax)
    const [selectedDateStartMax, setSelectedDateStartMax] = useState<MaterialUiPickersDate | null>(selectedDateEnd)
    const [selectedDateEndMin, setSelectedDateEndMin] = useState<MaterialUiPickersDate | null>(selectedDateStart) 
    const [dialogData, setDialogData] = useState<DashboardDataKaryawanAttedanceHistory[]>([])
    // eslint-disable-next-line
    const [dialogDataPart, setDialogDataPart] = useState<DialogDataPart>({id: 0, username: ''})

    const [snackBarOpen, setSnackBarOpen] = useState(false)
    // eslint-disable-next-line
    const [snackBarMessage, setSnackBarMessage] = useState('')

    // eslint-disable-next-line
    const { data } = useSWR<tableData[]>(`api/staff/attedance?perPage=${rowsPerPage}&page=${page}`)

    const handleDateChangeStart = (date: MaterialUiPickersDate | null) => {
        if (date) {
            setSelectedDateStart(date)
            setSelectedDateEndMin(date)

            console.group('handleDateChangeStart')
            console.log('date', date)
            console.groupEnd()

            runDialogData(dialogDataPart.id)
        }
    }
    const handleDateChangeEnd = (date: MaterialUiPickersDate | null) => {
        if (date) {
            setSelectedDateEnd(date)
            setSelectedDateStartMax(date)

            console.group('handleDateChangeEnd')
            console.log('date', date)
            console.groupEnd()

            runDialogData(dialogDataPart.id)
        }
    }

    // eslint-disable-next-line
    const dialogResetData = () => {
        setDialogData([])
        setSelectedDateStart(moment().subtract(30, 'days'))
        setSelectedDateEnd(dateMax)

        setSelectedDateStartMax(selectedDateEnd)
        setSelectedDateEndMin(selectedDateStart)
    }

    const runDialogData = (id: number) => {
        console.group('runDialog')
        console.log('id', id)
        console.log('selectedDateStart', selectedDateStart)
        console.log('selectedDateEnd', selectedDateEnd)
        console.groupEnd()

        axios.get<DashboardDataKaryawanAttedanceHistory[]>(`/api/staff/attedance/history?id=${id}&start=${selectedDateStart ? selectedDateStart.toISOString() : dateMin.toISOString()}&end=${selectedDateEnd ? selectedDateEnd.toISOString() : dateMax.toISOString()}`)
        .then(res => {setDialogData(res.data)})
        .catch(() => {
            setSnackBarMessage('Something went wrong')
        })
        .finally(() => {
            setRequestLoading(false)
        })
    }

    // eslint-disable-next-line
    const runDialog = (id: number) => {
        // return <Redirect to={`/staff/attendance/${id}`} />
        // if (!requestLoading) {
        //     dialogResetData()
        //     setRequestLoading(true)
        //     runDialogData(id)
        // }
    }

    const runDialogAction = () => {
        if (!requestLoading) {
            setRequestLoading(true)
            const params = new URLSearchParams()
            params.append('id', dialogDataPart.id.toString())
            params.append('start', selectedDateStart ? selectedDateStart.toISOString() : dateMin.toISOString())
            params.append('end', selectedDateEnd ? selectedDateEnd.toISOString() : dateMax.toISOString()) 
            axios.post('/api/staff/attedance/history/generate', params)
                .then(res => {window.open(res.data.url, '_self');})
                .catch(() => {})
                .finally(() => {
                    setRequestLoading(false)
                })
        }
    }

    // eslint-disable-next-line
    const handleChangePage = (_event: unknown, newPage: number) => {
        // console.log('handleChangePage', newPage)
        setPage(newPage)
    }
    
    // eslint-disable-next-line
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        // console.log('handleChangeRowsPerPage', event.target.value)
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // eslint-disable-next-line
    const handleDialogOpen = (item: tableData) => {
        return <Redirect to={`/staff/attendance/${item.id}`} />
        // setDialogDataPart({
        //     id: item.id,
        //     username: item.username
        // })
        // runDialog(item.id)
        // setDialogOpen(!dialogOpen)
    }

    const handleDialogClose = () => {
        if (dialogOpen)
            setDialogOpen(false)
    }

    const handleSnackbarMessage = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return
        }
    
        setSnackBarOpen(false)
    }

    return (
        <Fragment>
            <div className="sectionContainer">
                <div className="container">
                    <Typography variant="h5" gutterBottom>
                        Who attedance today
                    </Typography>
                    <Paper>
                        <TableContainer className={classes.root}>
                            <Table aria-label="data table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.headRowCellUsername}>Username</TableCell>
                                        <TableCell className={classes.headRowCellDateInfo} align="center">Time in</TableCell>
                                        <TableCell className={classes.headRowCellDateInfo} align="center">Time out</TableCell>
                                        <TableCell className={classes.headRowCellWorkHour} align="left">Work hour</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data?.map((row, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <div className="layout-column">
                                                        <span>{row.username}</span>
                                                        <div className="layout-row">
                                                            <Link className="selecableContent" to={`/staff/attendance/${row.id}`}>View attedance</Link>
                                                            {/* <Typography className="selecableContent" variant="caption" component="span" onClick={() => handleDialogOpen(row)}>View attedance</Typography> */}
                                                            {/* {'\u00A0|\u00A0'} */}
                                                            {/* <Typography className="selecableContent" variant="caption" component="span" onClick={() => handleDeleteDialog(row.id)}>Delete</Typography> */}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                        {
                                                            row.dateIn === null ? 'None' : ConvertHourMinuteSecond(row.dateIn)
                                                        }
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {
                                                            row.dateOut === null ? 'None' : ConvertHourMinuteSecond(row.dateOut)
                                                        }
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        { row.duration }
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

            {/*  */}
            <Dialog
                open={dialogOpen}
                onClose={() => handleDialogClose()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Attedance of {dialogDataPart.username}</DialogTitle>
                <DialogContent className={classes.userDialog}>
                    <div>
                        <Typography variant="caption" gutterBottom>
                            Date range
                        </Typography>
                        <div className="layout-row layout-align-center-center">
                            <KeyboardDatePicker
                                margin="normal"
                                id="history-start"
                                label="Start"
                                format="MM/DD/yyyy"
                                inputVariant="outlined"
                                value={selectedDateStart}
                                minDate={dateMin}
                                maxDate={selectedDateStartMax}
                                onChange={handleDateChangeStart}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <div className="flex"></div>
                            <KeyboardDatePicker
                                margin="normal"
                                id="history-end"
                                label="End"
                                format="MM/DD/yyyy"
                                inputVariant="outlined"
                                value={selectedDateEnd}
                                minDate={selectedDateEndMin}
                                maxDate={dateMax}
                                onChange={handleDateChangeEnd}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <TableContainer>
                            <Table aria-label="data table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.headRowCellDialogDate}>Date</TableCell>
                                        <TableCell className={classes.headRowCellDialogDateInfo} align="center">Time in</TableCell>
                                        <TableCell className={classes.headRowCellDialogDateInfo} align="center">Time out</TableCell>
                                        <TableCell className={classes.headRowCellDialogWorkHour} align="left">Work hour</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        dialogData?.map((item, idx) => {

                                            return (
                                                <TableRow key={idx}>
                                                    <TableCell component="th" scope="row">
                                                        { item.date }
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {
                                                            item.dateIn === null ? 'None' : ConvertHourMinuteSecond(item.dateIn)
                                                        }
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {
                                                            item.dateOut === null ? 'None' : ConvertHourMinuteSecond(item.dateOut)
                                                        }
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        { item.duration }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => runDialogAction()}>
                        Export attedance
                    </Button>
                    {/* <Button onClick={() => runDialogAction()} color="primary" autoFocus>
                        Yes
                    </Button> */}
                </DialogActions>
            </Dialog>

            {/* Snackbar Message */}
            <SnackbarMessage open={snackBarOpen} message={snackBarMessage} handleClose={handleSnackbarMessage} />
        </Fragment>
    )
}

export default StaffAttedanceComponent

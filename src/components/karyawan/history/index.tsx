import { KeyboardDatePicker } from "@material-ui/pickers"
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date"
import React, { Fragment, useEffect, useState } from "react"
import moment from "moment"
import { Button, Card, CardActions, CardContent, Paper, Typography, makeStyles, Theme, createStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import { ConvertHourMinuteSecond } from "../../../helper/dateTime"
import useSWR from "swr"

interface IProps {
    titleHandler: (title: string) => void
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            position: 'relative',
        },

        paperMarginTop: {
            marginTop: '16px'
        },
        
        margin: {
            margin: theme.spacing(1),
        },

        // Table
        headRowCellDate: {
            width: '20%',
        },
        headRowCellDateInfo: {
            width: '25%',
        },
        headRowCellWorkHour: {
            width: '30%',
        },
        
    }),
)

const KaryawanHistoryComponent = ({titleHandler}: IProps) => {
    const classes = useStyles()

    useEffect(() => {
        const initElement = () => {
            titleHandler('History')
        }
        initElement()
    }, [titleHandler])

    const dateMin = moment().subtract(1, 'years')
    const dateMax = moment()

    const [selectedDateStart, setSelectedDateStart] = useState<MaterialUiPickersDate | null>(moment().subtract(30, 'days'))
    const [selectedDateEnd, setSelectedDateEnd] = useState<MaterialUiPickersDate | null>(dateMax)

    const [selectedDateStartMax, setSelectedDateStartMax] = useState<MaterialUiPickersDate | null>(selectedDateEnd)
    const [selectedDateEndMin, setSelectedDateEndMin] = useState<MaterialUiPickersDate | null>(selectedDateStart)

    const { data } = useSWR<DashboardDataKaryawanAttedanceHistory[]>(`/api/karyawan/history?start=${selectedDateStart ? selectedDateStart.toISOString() : dateMin}&end=${selectedDateEnd ? selectedDateEnd.toISOString() : dateMax}`)

    const handleDateChangeStart = (date: MaterialUiPickersDate | null) => {
        if (date) {
            setSelectedDateStart(date)
            setSelectedDateEndMin(date)
        }
    }
    const handleDateChangeEnd = (date: MaterialUiPickersDate | null) => {
        if (date) {
            setSelectedDateEnd(date)
            setSelectedDateStartMax(date)
        }
    }

    

    return (
        <Fragment>
            <div className="sectionContainer">
                <div className="container">
                    <Card className="flex">
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
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
                        </CardContent>
                        <CardActions>
                            <Button size="small">Generate Report</Button>
                        </CardActions>
                    </Card>
                    <Paper className={classes.paperMarginTop}>
                        <TableContainer className={classes.root}>
                            <Table aria-label="data table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.headRowCellDate}>Date</TableCell>
                                        <TableCell className={classes.headRowCellDateInfo} align="center">Time in</TableCell>
                                        <TableCell className={classes.headRowCellDateInfo} align="center">Time out</TableCell>
                                        <TableCell className={classes.headRowCellWorkHour} align="left">Work hour</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data?.map((item, idx) => {

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
                    </Paper>
                </div>
            </div>
            
        </Fragment>
    )
}

export default KaryawanHistoryComponent

import { makeStyles, Theme, createStyles, Button, Card, CardActions, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import moment from 'moment'
import React, { Fragment, useEffect, useState } from 'react'
import { Redirect, RouteProps } from 'react-router-dom'
import useSWR from 'swr'
import axios from "axios"
import { KeyboardDatePicker } from '@material-ui/pickers'
import { ConvertHourMinuteSecond } from '../../../../helper/dateTime'

interface IProps extends RouteProps {
    titleHandler: (title: string) => void
    match: any
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

interface SWRData {
    user: string
    attedanceList: DashboardDataKaryawanAttedanceHistory[]
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

const StaffAttedanceViewComponent = (props: IProps) => {
    const classes = useStyles()

    useEffect(() => {
        console.log('route', props)
        const initElement = () => {
            props.titleHandler('Attedance')
        }
        initElement()
    }, [props.titleHandler])

    const userId = props?.match.params?.id

    const dateMin = moment().subtract(1, 'years')
    const dateMax = moment()

    const [requestLoading, setRequestLoading] = useState<boolean>(false)
    const [selectedDateStart, setSelectedDateStart] = useState<MaterialUiPickersDate | null>(moment().subtract(30, 'days'))
    const [selectedDateEnd, setSelectedDateEnd] = useState<MaterialUiPickersDate | null>(dateMax)

    const [selectedDateStartMax, setSelectedDateStartMax] = useState<MaterialUiPickersDate | null>(selectedDateEnd)
    const [selectedDateEndMin, setSelectedDateEndMin] = useState<MaterialUiPickersDate | null>(selectedDateStart)

    const { data, revalidate, error } = useSWR<SWRData>(`api/staff/attedance/history?id=${userId}&start=${selectedDateStart ? selectedDateStart.toISOString() : dateMin.toISOString()}&end=${selectedDateEnd ? selectedDateEnd.toISOString() : dateMax.toISOString()}`)
    
    if (error) {
        return <Redirect to={`/staff/attendance`} />
    }

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

    const generateReport = () => {
        if (!requestLoading) {
            setRequestLoading(true)
            const params = new URLSearchParams()
            params.append('id', userId.toString())
            params.append('start', selectedDateStart ? selectedDateStart.toISOString() : dateMin.toISOString())
            params.append('end', selectedDateEnd ? selectedDateEnd.toISOString() : dateMax.toISOString()) 
            axios.post('/api/staff/attedance/history/generate', params)
                .then(res => {window.open(res.data.url, '_self');})
                .catch(err => {})
                .finally(() => {
                    setRequestLoading(false)
                })
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
                            <Button size="small" onClick={generateReport} disabled={requestLoading}>Generate Report</Button>
                        </CardActions>
                    </Card>
                    <Paper className={classes.paperMarginTop}>
                        <Typography variant="h5" gutterBottom>
                            Attedance history of {data?.user}
                        </Typography>
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
                                        data?.attedanceList?.map((item, idx) => {

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

export default StaffAttedanceViewComponent

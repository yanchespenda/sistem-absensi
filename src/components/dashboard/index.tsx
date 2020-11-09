import React, { Fragment, useEffect } from "react"
import { Typography, Paper, createStyles, makeStyles, Theme, TableContainer, Table, TableCell, TableHead, TableRow, TableBody } from "@material-ui/core"
import useSWR from "swr"
import { ConvertHourMinuteSecond } from "../../helper/dateTime"

interface DashboardDataKaryawanAttedanceHistory {
    date: string
    info: string | null
    duration: string
    wasIn: boolean
    wasOut: boolean
    dateIn: string
    dateOut: string
}

interface DashboardDataKaryawan {
    attedance: boolean
    attedanceToday: number
    attedanceHistory: DashboardDataKaryawanAttedanceHistory[]
}

interface DashboardReturn {
    type: number
    data: DashboardDataKaryawan | null
    greeting: string | null
}

interface IProps {
    titleHandler: (title: string) => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            position: 'relative',
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

function DashboardComponent({ titleHandler }: IProps) {
    const classes = useStyles()

    const { data } = useSWR<DashboardReturn>('/api/dashboard')

    // console.log('data', data)

    useEffect(() => {
        const initElement = () => {
            titleHandler('Dashboard')
        }
        initElement()
    }, [titleHandler])

    const getComponent = (data: DashboardReturn) => {
        if (data.type === 3) {
            return getKaryawan(data)
        }
    }

    const getKaryawan = (data: DashboardReturn) => {
        return (
            <Fragment>
                <Paper>
                    <Typography variant="subtitle1" className={classes.margin}>
                    {
                        (data.data?.attedanceToday === 0) ? ('You are not yet attedance today') : (data.data?.attedanceToday === 1) ? ('You already atteded out today') : ('You already atteded in today')
                    }
                    </Typography>
                </Paper>
                <Paper>
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
                                    data.data?.attedanceHistory.map((item, idx) => {

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
            </Fragment>
        )
    }

    return (
        <Fragment>
            <div className="sectionContainer">
                <div className="container">
                    {
                        data ? (
                            <Fragment>
                                <Typography variant="h5" className={classes.margin}>
                                    {data.greeting}
                                </Typography>
                                {
                                    getComponent(data)
                                }
                            </Fragment>
                        ) : null
                    }
                </div>
            </div>
        </Fragment>
    )
}

export default DashboardComponent

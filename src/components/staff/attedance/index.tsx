import { createStyles, makeStyles, Paper, Theme, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography} from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import useSWR from "swr";
import { ConvertHourMinuteSecond } from "../../../helper/dateTime";
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

    // eslint-disable-next-line
    const { data } = useSWR<tableData[]>(`api/staff/attedance`)

    const [permissionFailed, setPermissionFailed] = useState(false)
    useEffect(() => {
        const initElement = () => {
            titleHandler('Attedance')
            axios.get<any>(`/api/staff/permission`).then(() => { }).catch(() => {
                setPermissionFailed(true)
            }).then( () => { })
        }
        initElement()
    }, [titleHandler])

    if (permissionFailed) {
        return <Redirect to="/" />
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
        </Fragment>
    )
}

export default StaffAttedanceComponent

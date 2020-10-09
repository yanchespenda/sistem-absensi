import React, { Fragment, useEffect } from "react"
import { makeStyles, Theme, createStyles, Paper, Toolbar, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@material-ui/core"

import AddIcon from '@material-ui/icons/Add'
import useSWR from "swr"
import { TimeLocal } from "../../../helper/dateTime"

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

    useEffect(() => {
        titleHandler('Setting Faces')
    }, [titleHandler])

    const { data } = useSWR<FaceResponse[]>('/api/karyawan/face')

    const handleDialogStatus = (id: number) => {

    }

    const handleDialogDelete = (id: number) => {
        
    }

    return (
        <Fragment>
            <div className="sectionContainer">
                <div className="container">
                    <Paper>
                        <Toolbar className={classes.mainToolbar}>
                            <div className="flex"></div>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="new data"
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
                                        <TableCell className={classes.headRowCellDateTime} align="right">Status</TableCell>
                                        <TableCell className={classes.headRowCellDateTime} align="right">Created at</TableCell>
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
                                                        <div>
                                                            <img src={row.face} alt={`face-${row.id}`} />
                                                        </div>
                                                        {/* <span>{row.username}</span> */}
                                                        <div className="layout-row">
                                                            <Typography className="selecableContent" variant="caption" component="span" onClick={() => handleDialogStatus(row.id)}>{row.active ? 'Deactivate' : 'Activate'}</Typography>
                                                            {'\u00A0|\u00A0'}
                                                            <Typography className="selecableContent" variant="caption" component="span" onClick={() => handleDialogDelete(row.id)}>Delete</Typography>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right">
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
        </Fragment>
    )
}

export default KaryawanFacesComponent

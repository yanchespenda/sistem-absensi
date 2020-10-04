import React, { Fragment, useEffect } from "react"

interface IProps {
    titleHandler: (title: string) => void
}

const AdminAttendanceComponent = ({titleHandler}: IProps) => {

    useEffect(() => {
        titleHandler('Attendance Management')
    }, [titleHandler])

    return (
        <Fragment>
            OK
        </Fragment>
    )
}

export default AdminAttendanceComponent

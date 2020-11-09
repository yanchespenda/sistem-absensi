import React, { Fragment } from 'react'

import DashboardIcon from '@material-ui/icons/Dashboard'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import PeopleIcon from '@material-ui/icons/People'
import SettingsIcon from '@material-ui/icons/Settings'
import FaceIcon from '@material-ui/icons/Face'
import EventNoteIcon from '@material-ui/icons/EventNote'
// import DashboardIcon from '@material-ui/icons/Dashboard'
// import DashboardIcon from '@material-ui/icons/Dashboard'

interface IProps {
    icon: string
}
function SidenavIconComponent({ icon }: IProps) {

    const convertStrToIcon = (icon: string) => {
        if (icon === 'DashboardIcon') {
            return <DashboardIcon />
        } else if (icon === 'AccountBoxIcon') {
            return <AccountBoxIcon />
        } else if (icon === 'PeopleIcon') {
            return <PeopleIcon />
        } else if (icon === 'SettingsIcon') {
            return <SettingsIcon />
        } else if (icon === 'FaceIcon') {
            return <FaceIcon />
        } else if (icon === 'EventNote') {
            return <EventNoteIcon />
        }
        return <Fragment />
    }

    return convertStrToIcon(icon)
}

export default SidenavIconComponent
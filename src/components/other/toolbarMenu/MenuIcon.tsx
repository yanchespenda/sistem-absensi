import React, { Fragment } from 'react'

import PeopleIcon from '@material-ui/icons/People'
import SettingsIcon from '@material-ui/icons/Settings'
import FaceIcon from '@material-ui/icons/Face'
import EventNoteIcon from '@material-ui/icons/EventNote'

interface IProps {
    icon: string
}
function MenuIconComponent({ icon }: IProps) {

    const convertStrToIcon = (icon: string) => {
        if (icon === 'PeopleIcon') {
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

export default MenuIconComponent
import React, { Fragment, useEffect } from "react"

interface IProps {
    titleHandler: (title: string) => void
}

const AccountAvatarComponent = ({titleHandler}: IProps) => {

    useEffect(() => {
        titleHandler('Setting avatar')
    }, [titleHandler])

    return (
        <Fragment>
            Test
        </Fragment>
    )
}

export default AccountAvatarComponent

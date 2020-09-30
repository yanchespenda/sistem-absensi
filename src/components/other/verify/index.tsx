import React, { Fragment } from 'react'
import { Typography, CircularProgress } from '@material-ui/core'

function OtherVerifyComponent() {

    return (
        <Fragment>
            <div className="flex">
                <div className="layout-column layout-align-center-center">
                    <Typography variant="h2" component="h2" gutterBottom>
                        Verifying
                    </Typography>
                    <CircularProgress size="3rem" color={'secondary'} />
                    <Typography variant="h6">
                        please wait...
                    </Typography>
                </div>
            </div>
        </Fragment>
    )
}

export default OtherVerifyComponent

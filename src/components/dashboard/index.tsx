import React, { Fragment, useEffect } from "react"
import { Grid, Container } from "@material-ui/core"

interface IProps {
    titleHandler: (title: string) => void
}

function DashboardComponent({ titleHandler }: IProps) {

    useEffect(() => {
        const initElement = () => {
            titleHandler('Dashboard')
        }
        initElement()
    }, [titleHandler])

    return (
        <Fragment>
            <Grid container justify="center">
                <Container maxWidth="sm">
                Work
                </Container>
            </Grid>
        </Fragment>
    )
}

export default DashboardComponent

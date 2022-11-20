import React, { useEffect, useState } from 'react'

import { 
    Grid,
    Container,
    Title,
} from '@mantine/core'


import Drive           from '../drive/drive'
import { connect }     from 'react-redux'
import { UpdateDrive } from '../../../data/actions/driveActions'
import { LoadDrive }   from "../../../data/backend/drive-operations"

const Dashboard = ({ user, drive, organization, updateDrive }) => {
    const [emptyDrive, setEmptyDrive] = useState(false)

    function GrabDrive() {
        let token = user.jwtToken
        if(token == "" || token == undefined)
            return

        const functions = {
            setEmptyDrive: setEmptyDrive,
            updateDrive: updateDrive
        }

        LoadDrive(organization, token, functions)
    }

    useEffect(() => {
        GrabDrive()
    }, [])

    useEffect(() => {
        GrabDrive()
    }, [drive.update_drive])
 
    return (
        <Container p={"xl"} fluid>
            <Grid gutter={0} columns={24} p={"xl"}>
                <Grid.Col span={24} pl={"xl"}>
                    <Drive 
                        emptyDrive={emptyDrive}
                        drive={drive} 
                    />
                </Grid.Col>
            </Grid>
        </Container>
    )
}

const mapStateToProps = state => ({
    drive: state.drive,
    organization: state.organization
})

const mapDispatchToProps = dispatch => ({
    updateDrive: (folders, projects) => { dispatch(UpdateDrive(folders, projects)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
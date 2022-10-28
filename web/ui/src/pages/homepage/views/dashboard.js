import React, { useEffect, useState } from 'react'

import { 
    Grid,
    Container,
    Title,
} from '@mantine/core'

import EmptyDrive      from '../drive/drive-components/empty-drive'
import Drive           from '../drive/drive'

import { connect }     from 'react-redux'
import { UpdateDrive } from '../../../data/actions/driveActions'

const Dashboard = ({ user, drive, updateDrive }) => {
    const [emptyDrive, setEmptyDrive] = useState(false)

    function GrabDrive() {
        let token = user.jwtToken
        if(token == "" || token == undefined)
            return

        let url = '/api/v1/drive'
        fetch(url, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}`}
        }).then(resp => resp.json()).then(data => {
            let projects = data['drive']['projects']
            let folders  = data['drive']['folders']
            
            if(folders.length == 0 && projects.length == 0)
                setEmptyDrive(true)
            else
            {
                setEmptyDrive(false)
                updateDrive(folders, projects)
            }
        })
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
                    {emptyDrive
                        ? (
                            <EmptyDrive 
                                TitleMSG={"Welcome to your Command Center"}
                                SubtitleMSG={"Click on the + New button to get started"}
                            />
                        )
                        : <Drive drive={drive} />
                    }
                </Grid.Col>
            </Grid>
        </Container>
    )
}

const mapStateToProps = state => ({
    drive: state.drive
})

const mapDispatchToProps = dispatch => ({
    updateDrive: (folders, projects) => { dispatch(UpdateDrive(folders, projects)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
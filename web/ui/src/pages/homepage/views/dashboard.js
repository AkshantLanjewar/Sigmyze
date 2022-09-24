import React, { useEffect, useState } from 'react'

import { 
    Grid,
    Container,
    Title,
} from '@mantine/core'

const Dashboard = ({ user }) => {
    const [emptyDrive, setEmptyDrive] = useState(false)

    useEffect(() => {
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
        })
    }, [])

    return (
        <Container p={"xl"} fluid>
            <Grid gutter={0} columns={24} p={"xl"}>
                <Grid.Col span={24} pl={"xl"}>
                    {emptyDrive
                        ? "empty bro"
                        : (
                            <div>
                                <Title order={4}>Last Edited</Title>
                            </div>
                        )
                    }
                </Grid.Col>
            </Grid>
        </Container>
    )
}

export default Dashboard
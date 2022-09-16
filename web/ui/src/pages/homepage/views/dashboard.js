import React from 'react'

import { 
    Grid,
    Container,
    Title,
} from '@mantine/core'

import DashboardNotification from '../dashboard-components/dashboard-notifications'

const Dashboard = ({ user }) => {
    return (
        <Container p={"xl"} fluid>
            <Grid gutter={0} columns={24} p={"xl"}>
                <Grid.Col span={24} pl={"xl"}>
                    <Title order={4}>Last Edited</Title>
                </Grid.Col>
            </Grid>
        </Container>
    )
}

export default Dashboard
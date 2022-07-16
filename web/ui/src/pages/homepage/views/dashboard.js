import React from 'react'

import { 
    Grid,
    Container 
} from '@mantine/core'

const Dashboard = ({ user }) => {
    return (
        <Container p={"xl"} fluid>
            <Grid gutter={0} columns={24}>
                <Grid.Col span={18}>

                </Grid.Col>

                <Grid.Col span={6}>

                </Grid.Col>
            </Grid>
        </Container>
    )
}

export default Dashboard
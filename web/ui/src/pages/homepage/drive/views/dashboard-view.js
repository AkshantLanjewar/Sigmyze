import React from 'react'

import { Container }    from '@mantine/core'
import PublishedManager from '../dashboard-components/published-manager'

const DashboardView = ({ }) => {
    return (
        <div>
            <Container>
                <PublishedManager />
            </Container>
        </div>
    )
}

export default DashboardView
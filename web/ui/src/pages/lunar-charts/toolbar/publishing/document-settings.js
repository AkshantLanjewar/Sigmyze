import React from 'react'

import {
    Box,
    Title
} from '@mantine/core'

const DocumentSettings = ({ }) => {
    return (
        <Box
            sx={(theme) => ({
                height: '50%',
                textAlign: 'center',
                flexGrow: 1,
            })}
        >
            <Title order={6} style={{ textTransform: 'uppercase' }}>Article Settings</Title>
        </Box>
    )
}

export default DocumentSettings
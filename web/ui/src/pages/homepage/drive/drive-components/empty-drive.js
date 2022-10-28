import React, { useState, useEffect } from 'react'

import { Box, Title } from '@mantine/core'

const EmptyDrive = ({ TitleMSG, SubtitleMSG }) => {
    return (
        <Box 
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',

                width: '100%',
                height: '100%',

                marginTop: 20,
                gap: 10
            }}
        >
            <Title>{TitleMSG}</Title>
            <Title order={3}>{SubtitleMSG}</Title>
        </Box>
    )
} 

export default EmptyDrive
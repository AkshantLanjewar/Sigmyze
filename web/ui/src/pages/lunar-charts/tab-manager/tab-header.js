import React from 'react'

import { Box, CloseButton } from '@mantine/core'

const TabHeader = ({ icon, name, editable, deleteTab, id }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 6,
                alignItems: 'center',
                justifyContent: 'apart',
                height: 22
            }}
        >
            {icon}
            {name}

            {editable
                ? ( <CloseButton size={'sm'} onClick={() => { deleteTab(id) }} />)
                : null
            }
        </Box>
    )
}

export default TabHeader
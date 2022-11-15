import React from 'react'

import {
    Box,
    Avatar,
    Text
} from '@mantine/core'

const DocumentAuthor = ({ }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <Avatar
                radius={"xl"}
                src={null}
                color={"Blue"}
                mr={"sm"}

                sx={{ width: 40, height: 40 }}
            >
                A
            </Avatar>

            <Box>
                <Text size={"sm"} color={"dimmed"}>Akshant Lanjewar</Text>
                <Text size={"sm"} color={"dimmed"}>May 18</Text>
            </Box>
        </Box>
    )
}

export default DocumentAuthor
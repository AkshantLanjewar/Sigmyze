import React, { useState, useEffect } from 'react'

import {
    Box,
    Avatar,
    Text
} from '@mantine/core'

import { GenerateInitials } from '../../lib'

const DocumentAuthor = ({ author }) => {
    const [date, setDate] = useState(new Date())
    let options = { month: 'short', day: 'numeric', year: 'numeric' }

    useEffect(() => {
        if('date' in author)
            setDate(author.date)
    }, [author])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <Avatar
                radius={"md"}
                src={null}
                color={"gray"}
                mr={"sm"}

                sx={{ width: 40, height: 40 }}
            >
                {GenerateInitials(author.name)}
            </Avatar>

            <Box>
                <Text size={"sm"} color={"dimmed"}>{author.name}</Text>
                <Text size={"sm"} color={"dimmed"}>
                    {date.toLocaleDateString("en-US", options)}
                </Text>
            </Box>
        </Box>
    )
}

export default DocumentAuthor
import React from 'react'

import { 
    Stack,
    Paper,
    Group,
    Text 
} from '@mantine/core'

import { FaBlog } from 'react-icons/fa'

const Notification = ({ }) => {
    return (
        <div>
            <Paper 
                p={"md"} 
                radius={"md"} 
                sx={(theme) => ({ 
                    background: theme.colors.dark[9], 
                    cursor: 'pointer',
                    'transition': 'ease-in-out 0.15s',
                    '&:hover': {
                        transform: 'scale(1.05)'
                    } 
                })}
            >
                <Group position={'apart'}>
                    <Text size={"xs"} color={"dimmed"} transform={'uppercase'}>
                        blog notification
                    </Text>

                    <FaBlog size={18} />
                </Group>

                <Text mt={18}>This is the main notification</Text>
                <Text size={'xs'} color={"dimmed"}>This is the sub notification</Text>
            </Paper>
        </div>
    )
}

const DashboardNotification = ({ }) => {
    return (
        <Stack pl="lg" pr={"lg"}>
            <Notification />
            <Notification />
            <Notification />
        </Stack>
    )
}

export default DashboardNotification
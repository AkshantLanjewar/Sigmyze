import React from 'react'

import { 
    Avatar,
    Menu,
    Divider,
    Group,
    Text 
} from "@mantine/core"

import { VscSignOut } from 'react-icons/vsc'

const UserControl = ({ username, email, logout }) => (
    <div>
        <Menu 
            control={<Avatar src={null} alt={username} color={"blue"}>AL</Avatar>}
            size={300}
            withArrow
        >
            <Menu.Item>
                <Group>
                    <Avatar 
                        radius={"xl"}
                        src={null}
                        alt={username}
                        color={"blue"}
                    >
                        AL
                    </Avatar>

                    <div>
                        <Text weight={500}>{username}</Text>
                        <Text size={"xs"} color={"dimmed"}>
                            {email}
                        </Text>
                    </div>
                </Group>
            </Menu.Item>

            <Divider />

            <Menu.Item icon={<VscSignOut size={14} />} onClick={logout}>Logout</Menu.Item>
        </Menu>
    </div>
)

export default UserControl
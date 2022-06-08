import React from "react"
import './user-navbar.scoped.scss'

import UserButton from '../../user-button/user-button'
import { Group } from '@mantine/core'

const UserNavbar = ({ }) => {
    return (
        <div>
            <Group position="center">
                <UserButton />
            </Group>
        </div>
    )
}

export default UserNavbar
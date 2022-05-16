import React from "react"
import './user-navbar.scoped.scss'

import AuthForm from '../auth-form/auth-form'

import { Modal, Button, Group } from '@mantine/core'

import { connect } from "react-redux"

const UserNavbar = ({ userModal, userModalAction }) => {
    return (
        <div>
            <Group position="center">
                <Button onClick={() => { userModalAction(true) }}>Login</Button>
            </Group>
        </div>
    )
}

export default UserNavbar
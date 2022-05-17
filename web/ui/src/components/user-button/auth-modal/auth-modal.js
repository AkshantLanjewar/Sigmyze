import React from "react"

import { Modal } from "@mantine/core"
import AuthForm  from './auth-form/auth-form'

import { connect }         from "react-redux"
import { userModalAction } from "../../../data/actions/userActions"

const AuthModal = ({ user, userModalAction }) => (
    <Modal
        centered
        title={"Welcome to Sigmyze"}
        opened={user.userModal}
        onClose={() => { userModalAction(false) }}
    >
        <AuthForm />
    </Modal>
)

const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    userModalAction: (payload) => dispatch(userModalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal)
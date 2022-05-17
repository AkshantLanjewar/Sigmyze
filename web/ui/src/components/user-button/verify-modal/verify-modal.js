import React from 'react'

import {
    Modal,
    Paper
} from "@mantine/core"

import { connect }         from 'react-redux'
import { verifyModalAction } from '../../../data/actions/userActions'
import VerifyForm from './verify-form'

const VerifyModal = ({ user, verifyModalAction }) => (
    <Modal
        centered
        title={"Verify your account"}
        opened={user.verifyModal}
        onClose={() => { verifyModalAction(false) }}
    >
        <Paper radius={"md"} p={"xl"}>
            <VerifyForm />
        </Paper>
    </Modal>
)

const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    verifyModalAction: (payload) => dispatch(verifyModalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(VerifyModal)
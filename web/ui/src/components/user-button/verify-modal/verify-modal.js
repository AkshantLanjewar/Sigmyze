import React, { useState } from 'react'

import {
    Modal,
    Paper,
    LoadingOverlay
} from "@mantine/core"

import { connect }         from 'react-redux'
import { verifyModalAction } from '../../../data/actions/userActions'
import VerifyForm from './verify-form'

const VerifyModal = ({ user, verifyModalAction }) => {
    const [loading, setLoading]     = useState(false)

    return (
        <Modal
            centered
            title={"Verify your account"}
            opened={user.verifyModal}
            onClose={() => { verifyModalAction(false) }}
        >
            <Paper radius={"md"} p={"xl"} style={{ position: "relative" }}>
                <LoadingOverlay 
                    visible={loading} 
                    loaderProps={{ variant: 'dots' }}
                />

                <VerifyForm modalAction={verifyModalAction} setLoading={setLoading} />
            </Paper>
        </Modal>
    )
}

const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    verifyModalAction: (payload) => dispatch(verifyModalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(VerifyModal)
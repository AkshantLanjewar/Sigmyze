import React from 'react'

import { Modal } from '@mantine/core'
import AuthForm  from '../../../components/user-button/auth-modal/auth-form/auth-form'

const DemoModal = ({ active, close }) => {
    return (
        <Modal
            centered
            opened={active}
            title={"Login to Unlock All Features"}
            onClose={close}
        >
            <div style={{ position: 'relative' }}>
                <AuthForm />
            </div>
        </Modal>
    )
}

export default DemoModal
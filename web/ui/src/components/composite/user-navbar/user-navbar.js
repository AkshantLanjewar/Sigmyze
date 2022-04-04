import React from "react"
import './user-navbar.scoped.scss'

import Button   from "../../basic/buttons/button"
import Modal    from "../../basic/modal/modal"
import AuthForm from '../auth-form/auth-form'

const UserNavbar = ({ userModal, userModalAction }) => {
    return (
        <div>
            <Modal modalState={userModal} setModalState={userModalAction}>
                <Button padding={"md"} pColor={"blue"} grow={false}>
                    <Button.Text>Login</Button.Text>
                </Button>

                <Modal.Title>Welcome to Sigmyze, login with</Modal.Title>

                <Modal.Body>
                    <AuthForm />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default UserNavbar
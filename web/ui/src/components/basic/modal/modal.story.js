import React from "react"

import Button from "../buttons/button"
import Modal from "./modal"

export default {
    component: Modal,
    title: 'Components/Basic/Modal',
    parameters: {
        layout: 'centered',
    },
}

const DefaultTemplate = args => (
    <Modal {...args}>
        <Button padding="md" pColor={"blue"}>
            <Button.Text>Login</Button.Text>
        </Button>

        <Modal.Title>Login Modal</Modal.Title>
        <Modal.Body>
            
        </Modal.Body>
    </Modal>
)

export const Default = DefaultTemplate.bind({})
Default.args = {

}
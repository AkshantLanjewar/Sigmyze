import React from "react"

import Button from "../buttons/button"
import Modal from "./modal"

export default {
    component: Modal,
    title: 'Modal',
    parameters: {
        layout: 'centered',
    },
}

const DefaultTemplate = args => (
    <Modal {...args}>
        <Button padding="md">
            <Button.Text>Login</Button.Text>
        </Button>
    </Modal>
)

export const Default = DefaultTemplate.bind({})
Default.args = {

}
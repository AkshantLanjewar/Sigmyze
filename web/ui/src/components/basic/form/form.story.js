import React from "react"

import { MdAlternateEmail } from 'react-icons/md'
import Form from "./form"
import Group from '../group/group'

export default {
    component: Form,
    title: 'Components/Basic/Form',
    parameters: {
        layout: 'centered',
    }
}

const DefaultTemplate = args => (
    <div style={{ width: "400px" }}>
        <Form>
            <Form.Element>
                <Group marginType={"sm"}>
                    <Form.Element.Label>E-Mail</Form.Element.Label>
                </Group>

                <Form.Element.TextInput {...args}>
                    <Form.Element.TextInput.Icon> <MdAlternateEmail /> </Form.Element.TextInput.Icon>
                </Form.Element.TextInput>
            </Form.Element>
        </Form>
    </div>
)

export const Default = DefaultTemplate.bind({})
Default.args = {

}

export const CustomizableText = DefaultTemplate.bind({})
CustomizableText.args = {
    radius: 'md',
    size: 'md',
    type: 'email',
    disabled: false,
    invalid: false
}
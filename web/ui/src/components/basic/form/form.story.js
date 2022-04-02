import React, { useState } from "react"

import { MdAlternateEmail } from 'react-icons/md'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

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
    placeholder: "Your E-Mail"
}

export const CustomizableText = DefaultTemplate.bind({})
CustomizableText.args = {
    radius: 'md',
    size: 'md',
    type: 'email',
    disabled: false,
    invalid: false,
    placeholder: "Your E-Mail"
}

const ButtonTemplate = args => {
    const [iconState, setIconState] = useState(false)
    
    return (
        <div style={{ width: "400px" }}>
            <Form>
                <Form.Element>
                    <Group marginType={"sm"}>
                        <Form.Element.Label>Password</Form.Element.Label>
                    </Group>

                    <Form.Element.TextInput {...args}>
                        <Form.Element.TextInput.Icon> 
                            <MdAlternateEmail /> 
                        </Form.Element.TextInput.Icon>

                        <Form.Element.TextInput.RightButton sxOnClick={() => { setIconState(!iconState) }}>
                            {iconState ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </Form.Element.TextInput.RightButton>
                    </Form.Element.TextInput>
                </Form.Element>
            </Form>
        </div>
    )
}

export const RightButton = ButtonTemplate.bind({})
RightButton.args = {
    placeholder: "Your Password"
}

const CheckboxTemplate = args => (
    <div style={{ width: '400px' }}>
        <Form>
            <Form.Element>
                <Form.Element.CheckBoxInput></Form.Element.CheckBoxInput>
            </Form.Element>
        </Form>
    </div>
)
export const Checkbox = CheckboxTemplate.bind({})
Checkbox.args = {
    
}
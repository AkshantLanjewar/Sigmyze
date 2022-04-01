import React from "react"

import Group from "./group"
import Button from "../buttons/button"
import { AiOutlineGoogle } from 'react-icons/ai'

export default {
    component: Group,
    title: 'Group',
    parameters: {
        layout: 'centered',
    },
}

const DefaultTemplate = args => (
    <Group {...args}>
        <Button padding={"md"} pColor={"black"} rounding="rounding-lg">
            <Button.Icon><AiOutlineGoogle /></Button.Icon>
            <Button.Text>
                <Button.Text.Title>Google</Button.Text.Title>
            </Button.Text>
        </Button>

        <Button padding={"md"} pColor={"black"} rounding="rounding-lg">
            <Button.Icon><AiOutlineGoogle /></Button.Icon>
            <Button.Text>
                <Button.Text.Title>Facebook</Button.Text.Title>
            </Button.Text>
        </Button>
    </Group>
)

export const Default = DefaultTemplate.bind({})
Default.args = {

}
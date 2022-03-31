import React from "react"

import Group from "./group"
import Button from "../buttons/button"

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
            <Button.Text>Google</Button.Text>
        </Button>

        <Button padding={"md"} pColor={"black"} rounding="rounding-lg">
            <Button.Text>Facebook</Button.Text>
        </Button>
    </Group>
)

export const Default = DefaultTemplate.bind({})
Default.args = {

}
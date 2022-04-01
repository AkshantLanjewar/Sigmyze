import React from "react"

import Card from "./card"
import Group from "../group/group"
import Button from "../buttons/button"
import { AiOutlineGoogle } from 'react-icons/ai'

export default {
    component: Card,
    title: 'Components/Basic/Card',
    parameters: {
        layout: 'centered',
    },
}

const DefaultTemplate = args => (
    <Card {...args}>
        
    </Card>
)

export const Default = DefaultTemplate.bind({})
Default.args = {
    minWidth: 450
}

const TextRowTemplate = args => (
    <Card {...args}>
        <Card.TextRow>{args.text}</Card.TextRow>
    </Card>
)

export const TextRow  = TextRowTemplate.bind({})
TextRow.args = {
    text: 'Kai is a little uwu sub'
}

const GroupTemplate = args => (
    <Card {...args}>
        <Group>
            <Button padding={"md"} pColor={"blue"} rounding={"rounding-lg"}>
                <Button.Icon><AiOutlineGoogle /></Button.Icon>
                <Button.Text>
                    <Button.Text.Title>Google</Button.Text.Title>
                </Button.Text>
            </Button>

            <Button padding={"md"} pColor={"blue"} rounding={"rounding-lg"}>
                <Button.Icon><AiOutlineGoogle /></Button.Icon>
                <Button.Text>
                    <Button.Text.Title>Facebook</Button.Text.Title>
                </Button.Text>
            </Button>
        </Group>
    </Card>
)
export const GroupExample = GroupTemplate.bind({})
GroupExample.args = {

}
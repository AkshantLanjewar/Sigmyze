import React from "react"

import { FaAirbnb } from 'react-icons/fa'
import Button from "./button"

export default {
    component: Button,
    title: 'Button'
}

const Template = args => (
    <Button {...args}>
        <Button.Text>{args.text}</Button.Text>
    </Button>
)

export const Default = Template.bind({})
Default.args = {
    text: 'Test Button'
}

const IconTemplate = args => (
    <Button {...args}>
        <Button.Icon><FaAirbnb /></Button.Icon>
        <Button.Text>{args.text}</Button.Text>
    </Button>
)

export const Icon = IconTemplate.bind({})
Icon.args = {
    text: 'Test Icon'
}
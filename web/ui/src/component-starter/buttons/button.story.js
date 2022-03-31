import React from "react"

import { FaAirbnb } from 'react-icons/fa'
import Button from "./button"

export default {
    component: Button,
    title: 'Button',
    parameters: {
        layout: 'centered',
    },
}

const Template = args => (
    <Button {...args}>
        <Button.Text>{args.text}</Button.Text>
    </Button>
)

export const Default = Template.bind({})
Default.args = {
    text: 'Test Button',
    padding: 'md',
    pColor: 'black',
    rounding: 'rounding-md',
}

const IconTemplate = args => (
    <Button {...args}>
        <Button.Icon><FaAirbnb /></Button.Icon>
        <Button.Text>{args.text}</Button.Text>
    </Button>
)

export const Icon = IconTemplate.bind({})
Icon.args = {
    text: 'Test Icon',
    padding: 'md',
    pColor: 'black',
    rounding: 'rounding-lg',
}

function TestOnclick() {
    console.log("testclicked")
}

const DropDownTemplate = args => (
    <Button {...args}>
        <Button.Icon><FaAirbnb /></Button.Icon>
        <Button.Text>{args.text}</Button.Text>

        <Button.Dropdown>
            <Button.Dropdown.Item>
                <Button.Dropdown.Item.DropdownIcon><FaAirbnb /></Button.Dropdown.Item.DropdownIcon>

                <Button.Dropdown.Item.DropdownTitle>Kai</Button.Dropdown.Item.DropdownTitle>
                <Button.Dropdown.Item.DropdownSymbol>Monno</Button.Dropdown.Item.DropdownSymbol>
            </Button.Dropdown.Item>

            <Button.Dropdown.Item sxOnClick={TestOnclick}>
                <Button.Dropdown.Item.DropdownIcon><FaAirbnb /></Button.Dropdown.Item.DropdownIcon>

                <Button.Dropdown.Item.DropdownTitle>Kai</Button.Dropdown.Item.DropdownTitle>
                <Button.Dropdown.Item.DropdownSymbol>Monno</Button.Dropdown.Item.DropdownSymbol>
            </Button.Dropdown.Item>
        </Button.Dropdown>
    </Button>
)

export const Dropdown = DropDownTemplate.bind({})
Dropdown.args = {
    text: 'Test Dropdown',
    padding: 'md',
    pColor: 'black',
    rounding: 'rounding-md',
}
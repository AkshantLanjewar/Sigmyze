import React from "react"
import Navbar from "./navbar"

export default {
    component: Navbar,
    title: 'Components/Composite/Navbar'
}

const Template = args => <Navbar {...args} />

export const Default = Template.bind({})
Default.args = {
    parameters: {
        layout: 'centered',
    }
}
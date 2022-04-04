import React from "react"
import UserNavbar from "./user-navbar"

export default {
    component: UserNavbar,
    title: 'Components/Composite/UserNavbar',
    parameters: {
        layout: 'centered',
    },
}

const Template = args => <UserNavbar {...args} />

export const Default = Template.bind({})
Default.args = {
    logged_in: true
}
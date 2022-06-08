import React from "react"
import AuthForm from "./auth-form"

export default {
    component: AuthForm,
    title: 'Components/Composite/Auth Form',
    parameters: {
        layout: 'centered',
    }
}

const Template = args => <AuthForm {...args} />
export const Default = Template.bind({})
Default.args = {
    
}
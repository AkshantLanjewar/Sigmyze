import React from "react"
import AuthForm from "./auth-form"

export default {
    component: AuthForm,
    title: 'Auth Form'
}

const Template = args => <AuthForm {...args} />
export const Default = Template.bind({})
Default.args = {
    
}
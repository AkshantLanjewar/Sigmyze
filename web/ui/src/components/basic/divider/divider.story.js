import React from 'react'
import Divider from './divider'

export default {
    component: Divider,
    title: 'Components/Basic/Divider',
    parameters: {
        layout: 'centered',
    },
}

const DefaultTemplate = args => ( 
    <div style={{ width: "500px" }}>
        <Divider {...args} /> 
    </div>
)
export const Default = DefaultTemplate.bind({})
Default.args = {
    label: "This is the divider text"
}

export const DividerPosition = DefaultTemplate.bind({})
DividerPosition.args = {
    label: "This is the divider text",
    position: "right"
}
import React from "react"
import AppShell from "./shell"

export default {
    component: AppShell,
    title: 'Components/App/App Shell',
}

const Template = args => (
    <AppShell {...args}>
        <AppShell.Side>

        </AppShell.Side>

        <AppShell.Main>
            
        </AppShell.Main>
    </AppShell>
)
export const Default = Template.bind({})
Default.args = {

}
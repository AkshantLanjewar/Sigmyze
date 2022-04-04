import React from "react"
import Sidenav from "./sidenav"

import Logo from '../../../assets/logo.svg'

import { AiFillHome } from 'react-icons/ai'

export default {
    component: Sidenav,
    title: 'Components/Composite/Sidenav',
    parameters: {
        layout: 'centered',
    },
}

const Template = args => (
    <div style={{ width: args.expanded ? "16.25rem" : "3.75rem", backgroundColor: "#0a0a0a" }}>
        <Sidenav {...args}>
            <Sidenav.Brand image={Logo} text={"Lunar"} />

            <Sidenav.Nav>
                <Sidenav.Nav.Element icon={<AiFillHome />} pName={"Homepage"} />
            </Sidenav.Nav>
        </Sidenav>
    </div>
)
export const Default = Template.bind({})
Default.args = {
    expanded: false
}

const BrandTemplate = args => (
    <div style={{ width: args.expanded ? "16.25rem" : "3.75rem", backgroundColor: "#0a0a0a" }}>
        <Sidenav {...args}>
            <Sidenav.Brand image={Logo} text={"Lunar"} />
        </Sidenav>
    </div>
)
export const Brand = BrandTemplate.bind({})
Brand.args = {
    expanded: false
}

const NavTemplate = args => (
    <div style={{ width: args.expanded ? "16.25rem" : "3.75rem", backgroundColor: "#0a0a0a" }}>
        <Sidenav {...args}>
            <Sidenav.Nav>
                <Sidenav.Nav.Element icon={<AiFillHome />} pName={"Homepage"} />
            </Sidenav.Nav>
        </Sidenav>
    </div>
)
export const Nav = NavTemplate.bind({})
Nav.args = {
    expanded: false
}
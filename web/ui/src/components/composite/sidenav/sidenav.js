import React, { useState, useEffect } from "react"
import './sidenav.scoped.scss'

import Group from '../../basic/group/group'

import Nav   from "./sub-components/nav"
import Brand from "./sub-components/brand"

const Sidenav = ({ expanded, children }) => {
    const [hasBrand, setHasBrand] = useState(false)
    const [hasNav, setHasNav]     = useState(false)

    const nav   = React.Children.map(children, child => child.type.displayName === 'nav' ? child : null)
    const brand = React.Children.map(children, child => child.type.displayName === 'brand' ? child : null)

    useEffect(() => {
        if(brand != undefined && brand.length > 0)
            setHasBrand(true)
        if(nav != undefined && nav.length > 0)
            setHasNav(true)
    }, [children])

    return (
        <div className="sidenav">
            <Group type={"column"} marginType={"sm"} gapSize={"lg"}>
                {hasBrand ? React.cloneElement(brand[0], { expanded: expanded }) : null}
                {hasNav ? React.cloneElement(nav[0], { expanded: expanded }) : null}
            </Group>
        </div>
    )
}

Sidenav.Brand = Brand
Sidenav.Nav   = Nav

export default Sidenav
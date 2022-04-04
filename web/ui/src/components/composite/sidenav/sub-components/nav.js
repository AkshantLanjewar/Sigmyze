import React, { useState, useEffect } from "react"
import './nav.scoped.scss'

const Nav = ({ expanded, children }) => {
    const elements = React.Children.map(children, child => child.type.displayName === 'element' ? child : null)

    return (
        <div className="nav">
            <ul className={`${expanded ? 'expanded' : ''}`}>
                {elements}
            </ul>
        </div>
    )
}

const svgStyle = {
    fontSize: "1.125rem",
    lineHeight: "1.4",
    opacity: "0.7"
}

const NavElement = ({ url, active, icon, pName }) => {
    const [hasIcon,setHasIcon]  = useState(false)
    const [hasName, setHasName] = useState(false)

    useEffect(() => {
        if(icon != undefined)
            setHasIcon(true)
        if(pName != undefined)
            setHasName(true)
    }, [pName, icon])

    return (
        <li className={`element tooltip-right t-side ${active ? 'active' : ''}`} data-tooltip={hasName ? pName : ''}>
            <a href={url}>
                {hasIcon ? React.cloneElement(icon, { style: svgStyle }) : null}

                <span>{pName}</span>
            </a>
        </li>
    )
}

NavElement.displayName = "element"
Nav.Element            = NavElement

Nav.displayName = "nav"
export default Nav
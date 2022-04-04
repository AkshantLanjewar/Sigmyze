import React, { useState, useEffect } from "react"
import './navbar.scoped.scss'

import { RiMenu3Line } from 'react-icons/ri'

import UserNavbar from "../user-navbar/user-navbar"

const Navbar = ({ expandAside }) => {
    const [togglerState, setTogglerState] = useState(false)
    useEffect(() => {
        expandAside(togglerState)
    }, [togglerState])

    return (
        <div className="navbar">
            <div>
                <button className={`toggler ${togglerState ? 'toggled' : ''}`}
                    onClick={() => { setTogglerState(!togglerState) }}>
                    <RiMenu3Line />
                </button>
            </div>

            <UserNavbar />
        </div>
    )
}

export default Navbar
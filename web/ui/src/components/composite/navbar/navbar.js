import React from "react"
import './navbar.scoped.scss'

import { RiMenu3Line } from 'react-icons/ri'


function Navbar() {
    return (
        <div className="navbar">
            <div>
                <button className="toggler"> <RiMenu3Line /> </button>
            </div>

            <div>
                swag
            </div>
        </div>
    )
}

export default Navbar
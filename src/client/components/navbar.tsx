import React, { useEffect } from "react";
import Logo from '../svg/logo.svg'

function Navbar() {
    useEffect(() => {

    })

    return (
        <div className="navbar">
            <a className="title" href="/">Lunar</a>

            <ul className="nav_elements">
                {/*<li className="element"><a href="/roadmap">Roadmap</a></li>*/}
            </ul>
        </div>
    )
}

export default Navbar;
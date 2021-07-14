import React, { useEffect } from "react";
import './sass/navbar.scss';

function Navbar() {
    useEffect(() => {

    })

    return (
        <div className="navbar">
            <h1 className="title">Lunar</h1>

            <ul className="nav_elements">
                <li className="element">About</li>
                <li className="element">Roadmap</li>
            </ul>
        </div>
    )
}

export default Navbar;
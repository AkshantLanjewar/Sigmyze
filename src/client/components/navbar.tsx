import React, { useEffect } from "react";
import Logo from '../svg/logo.svg'

function Navbar() {
    useEffect(() => {

    })

    return (
        <nav className="navbar is-black is-fixed-top">
            <div className="navbar__inner">
                <div className="left">
                    <a className="brand" href="/">
                        <img src={Logo} width={32} height={32} />
                        <b>Lunar</b>
                    </a>

                    
                </div>

                <div className="right">
                    <a className="nav-item" href="/compare">Indicators</a>
                    <a className="nav-item" href="/blog">Blog</a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
import React, { useEffect } from "react";
import Logo from '../svg/logo.svg'

function Navbar() {
    useEffect(() => {

    })

    return (
        <nav className="navbar is-black is-fixed-top">
            <div className="navbar__inner">
                <div className="left">
                    <a className="brand">
                        <img src={Logo} width={32} height={32} />
                        <b>Lunar</b>
                    </a>

                    
                </div>

                <div className="right">

                </div>
            </div>
        </nav>
    )
}

export default Navbar;
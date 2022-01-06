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
                        <b>Sigmyze </b>
                    </a>
                    <div style={{fontSize:'0.6em'}}>Ver: Alpha</div>

                </div>

                <div className="right">
                    <a className="nav-item" href="/indicator">Country Charts</a>
                </div>
                <div className="right">
                    <a className="nav-item" href="/chart">MyChart</a>
                </div>
                <div className="right">
                    <a className="nav-item" href="/about">About Us</a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;

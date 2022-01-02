import React from "react";
import Logo from '../../../../svg/logo.svg'

function ChartNavbar() {
    return (
        <div className="c-nav">
            <div className="left">
                <a className="brand" href="/">
                    <img src={Logo} width={32} height={32} />
                    <b>Sigmyze</b>
                </a>
            </div>
        </div>
    )
}

export default ChartNavbar
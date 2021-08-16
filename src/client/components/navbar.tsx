import React, { useEffect } from "react";

function Navbar() {
    useEffect(() => {

    })

    return (
        <div className="navbar">
            <a className="title" href="/">Lunar</a>

            <ul className="nav_elements">
                {/*<li className="element"><a href="/roadmap">Roadmap</a></li>*/}
                <li className="element"><a href="/blog">Blog</a></li>
            </ul>
        </div>
    )
}

export default Navbar;
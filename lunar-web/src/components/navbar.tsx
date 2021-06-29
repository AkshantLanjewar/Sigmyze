import React from "react";

function Navbar() : JSX.Element {
    return (
        <header>
            <nav>
                <div className="wrapper">
                    <a className="logo">Lunar</a>

                    <ul className="menu">
                        <li>
                            <a href="/">Home</a>
                        </li>

                        <li>
                            <a href="#">Documentation</a>
                        </li>

                        <li>
                            <a href="#">Roadmap</a>
                        </li>

                        <li>
                            <a href="#">Blog</a>
                        </li>
                    </ul>

                    <ul className="user"></ul>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
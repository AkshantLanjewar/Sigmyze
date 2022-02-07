import React, { useState } from "react"

import { BsThreeDots, BsFillTrashFill } from 'react-icons/bs'

function Project() {
    const [showDropdown, setShowDropdown] = useState(false)

    return (
        <div className="project">
            <div className="item">
                <h1 className="title">Project Name</h1>
            </div>

            <div className="item updated">Last Updated</div>
            <div className="item"></div>
            <div className="item"></div>

            <div className="item">
                <button className="open">
                    <span>Open</span>
                </button>

                <div className="options">
                    <button className="dots" onFocus={() => { setShowDropdown(true) }} ><BsThreeDots /></button>
                </div>
            </div>

            <div className="dropdown" style={{display: showDropdown ? "flex" : "none"}} onMouseLeave={() => { setShowDropdown(false) }}>
                <div className="actions">
                    <a className="action" onClick={() => { console.log("click") }}>
                        <BsFillTrashFill />

                        <span>Delete Project</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Project
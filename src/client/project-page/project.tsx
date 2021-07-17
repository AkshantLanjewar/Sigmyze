import React from "react"
import './sass/project.scss'

import { AiOutlineEllipsis } from "react-icons/ai"

const Project: React.FC<{}> = ({children}) => {
    return (
        <div className="project">
            <div className="thumbnail"></div>

            <div className="p-row">
                <span className="title">Lunar</span>

                <div className="elip-dropdown">
                    <div className="vis">
                        <AiOutlineEllipsis />
                    </div>

                    <div className="content">
                        <ul className="dropdown">
                            <li>Delete Business</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="p-row">
                <span className="update">Updated 12 Hours ago</span>
            </div>
        </div>
    )
}

export default Project
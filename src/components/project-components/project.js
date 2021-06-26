import React from "react"
import Dots from '../icons/dots'

function Project(props) {
    let grid_classes = "grid-item"
    if(props.grid_active)
        grid_classes += " active"

    return (
        <div className={grid_classes}>
            <li onClick={() => props.sClick(props.index)}>
                <div className="sections">
                    <div className="title">
                        <div>
                            <span size="3">Project Name</span>
                        </div>
                    </div>

                    <div className="last-updated">
                        <span>Updated 3 months ago</span>
                    </div>

                    <div className="creator">
                        <span>Webscraper</span>
                    </div>
                </div>

                <button className="dots">
                    <Dots />
                </button>
            </li>
        </div>
    )
}

export default Project
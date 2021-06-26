import React from "react"

import CrawlerIcon from "../icons/project-icons/crawler"
import DatabaseIcon from "../icons/project-icons/database"

function ProjectTemplate(props) {

    const projectType = props.projectType

    let icon
    let itm_name

    if(projectType == "data_scraper") {
        icon = <CrawlerIcon />
        itm_name = "Data Scraper"
    } else if (projectType == "database_io") {
        icon = <DatabaseIcon />
        itm_name = "Database IO"
    }

    return (
        <button>
            <div className="icon">
                {icon}
            </div>

            <div className="text">
                <div className="row">
                    <span className="title">{itm_name}</span>
                </div>
                <div className="row">
                    <span className="author">By Leptron</span>
                </div>
            </div>
        </button>
    )
}

export default ProjectTemplate
import React from "react"

import FolderIcon from './icons/folder-icon'
import RepoIcon from './icons/repo-icon'
import StarIcon from './icons/star-icon'

function SidebarItem(props) {

    let icon

    if(props.icon == "folder")
        icon = <FolderIcon />
    if(props.icon == "repo")
        icon = <RepoIcon />
    if(props.icon == "star")
        icon = <StarIcon />

    return (
        <li>
            <a>
                <span>
                    {icon}
                </span>

                {props.title}
            </a>
        </li>
    )
}

export default SidebarItem
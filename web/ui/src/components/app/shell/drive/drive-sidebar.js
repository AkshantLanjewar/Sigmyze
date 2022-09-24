import React, { useState } from 'react'

import { 
    Box, 
    Text,
    Group 
} from '@mantine/core'

import DriveCreateMenu from './drive-createmenu'
import useStyles       from './drive-styles'

import { TbStar, TbTrash, TbClock, TbCloudStorm } from 'react-icons/tb'

import { LINK_HEIGHT, INDICATOR_OFFSET, INDICATOR_SIZE } from './drive-styles'

const DriveTab = ({ index, active, setActive, title, icon }) => {
    const { classes, cx } = useStyles()

    return (
        <Box
            component={'a'}
            href={"#"}
            onClick={(event) => {
                event.preventDefault()
                setActive(index)
            }}

            className={cx(classes.link, { [classes.linkActive]: active === index })}
        >
            {icon}
            {title}
        </Box>
    )
}

let sidebar_components = [
    {
        title: "Workspace",
        title_id: "workspace",
        icon: <TbCloudStorm size={18} />
    },
    {
        title: "Recent",
        title_id: "recent_workspace",
        icon: <TbClock size={18} />
    },
    {
        title: "Starred",
        title_id: "starred_workspace",
        icon: <TbStar size={18} />
    },
    {
        title: "Trash",
        title_id: "trashed_workspace",
        icon: <TbTrash size={18} />
    }
]

const DriveSidebar = ({ }) => {
    const { classes, cx }     = useStyles()
    const [active, setActive] = useState(0)

    return (
        <Box 
            pb={"md"} 
            mb={"xl"} 
            mx={"sm"}

            sx={(theme) => ({
                display: 'flex', 
                flexDirection: 'column',
                borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
            })}
        >
            <DriveCreateMenu />

            <Box mt={"md"}>
                {sidebar_components.map((item, index) => (
                    <DriveTab
                        index={index}
                        active={active}
                        setActive={() => { setActive(index) }}
                        title={item.title}
                        icon={item.icon}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default DriveSidebar
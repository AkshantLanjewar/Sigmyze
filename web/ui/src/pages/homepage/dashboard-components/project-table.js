import React, { useState } from 'react'

import { 
    ScrollArea,
    Group,
    Menu,
    TextInput,
    Grid, 
    Text
} from '@mantine/core'

import useStyles from './project-table.styles'

import { 
    AiFillFolderOpen,
    AiFillDelete 
} from 'react-icons/ai'
import { 
    BsFillGearFill,
    BsArchiveFill 
} from 'react-icons/bs'

import { FaSearch } from 'react-icons/fa'

const ProjectTableRow = ({ items }) => {
    const { classes } = useStyles()
    let span          = 12 / items.length

    return (
        <Grid className={classes.grid}>
            {items.map(step => (
                <Grid.Col span={span}>
                    <Text size={"sm"} weight={"bold"}>
                        {step}
                    </Text>
                </Grid.Col>
            ))}
        </Grid>
    )
}

const ProjectsTable = ({ }) => {
    const [searchState, setSearchState] = useState("")

    const { classes } = useStyles()

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget
        setSearchState(value)
    }

    const menuComponent = (
        <Group position={'right'}>
            <Menu
                position={'right'}
                placement={'end'}
                withArrow
            >
                <Menu.Label>Projects</Menu.Label>

                <Menu.Item icon={<AiFillFolderOpen size={14} />}>Open Project</Menu.Item>
                <Menu.Item icon={<BsFillGearFill size={14} />}>Project Settings</Menu.Item>
                <Menu.Item icon={<BsArchiveFill size={14} />}>Archive Project</Menu.Item>
                <Menu.Item icon={<AiFillDelete size={14} />}>Delete Project</Menu.Item>
            </Menu>
        </Group>
    )

    let projects = [1, 2, 3, 4, 5, 6, 6, 7]

    return (
        <div>
            <TextInput
                placeholder='Search any field'
                mb='md'
                icon={<FaSearch size={14} />}
                value={searchState}
                onChange={handleSearchChange}
            />

            <div style={{ paddingLeft: '1em', paddingRight: '1em' }}>
                <ProjectTableRow 
                    items={['Project Name', 'Project Short', 'Last Edited', '']} 
                />

                {projects.map(step => (
                    <ProjectTableRow 
                        items={['Cool Project', 'PNPY', 'July 2022', menuComponent]} 
                    />
                ))}
            </div>
        </div>
    )
}

export default ProjectsTable
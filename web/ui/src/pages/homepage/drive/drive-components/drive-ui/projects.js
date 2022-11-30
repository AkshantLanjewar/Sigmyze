import React, { useState } from 'react'

import { 
    Box,
    Text,
    SimpleGrid,
    Menu,
    ActionIcon 
} from '@mantine/core'

import { extractType } from '../../../../../components/lib'

import { 
    TbDots,
    TbSettings,
    TbTrash,
    TbCloudUpload 
} from 'react-icons/tb'

import ProjectModal from './modals/project-modal'
import ProjectShell from './project-shell'

const Project = ({ title, type, id }) => {
    const [opened, setOpened]         = useState(false)
    const [modalState, setModalState] = useState("update")
    let projectInfo                   = extractType(type)

    function OpenProject() {
        let url = `/lunar?projectId=${id}`
        window.open(url, '_blank')
    }

    function UpdateProject() {
        setModalState("update")
        setOpened(true)
    }

    function DeleteProject() {
        setModalState("delete")
        setOpened(true)
    }

    let menu = (
        <Menu
            shadow={"md"}
            width={200}
            position={"bottom"}
            withArrow
        >
            <Menu.Target>
                <ActionIcon>
                    <TbDots size={16} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown sx={(theme) => ({ backgroundColor: theme.colors.dark[7] })}>
                <Menu.Item
                    icon={<TbCloudUpload size={18} />}
                    onClick={() => { OpenProject() }}
                >
                    Open Project
                </Menu.Item>

                <Menu.Item
                    icon={<TbSettings size={18} />}
                    onClick={() => { UpdateProject() }}
                >
                    Update Project
                </Menu.Item>

                <Menu.Item
                    icon={<TbTrash size={18} />}
                    onClick={() => { DeleteProject() }}
                >
                    Delete Project
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )

    return (
        <Box>
            <ProjectModal 
                opened={opened}
                setOpened={setOpened}
                modalState={modalState}
                id={id}
                title={title}
            />

            <ProjectShell
                dblClick={OpenProject}
                title={title}
                type={`${type} Project`}
                menu={menu}
                icon={projectInfo['icon']}
            />
        </Box>
    )
}

const Projects = ({ projects }) => {
    return (
        <Box mt={"xl"}>
            <Text
                size={"sm"}
                color={"dimmed"}
                transform={"uppercase"}
            >
                Projects
            </Text>

            <SimpleGrid
                cols={5}
                spacing={"md"}
                mt={"sm"}
            >
                {projects.map((step, i) => (
                    <Project
                        key={`project-${i}`}
                        title={step.project_name}
                        type={"lunar"}
                        id={step.project_id}
                    />
                ))}
            </SimpleGrid>
        </Box>
    )
}

export default Projects
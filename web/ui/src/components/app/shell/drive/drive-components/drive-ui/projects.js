import React, { useState } from 'react'

import { 
    Box,
    Text,
    SimpleGrid,
    Card,
    Title,
    Menu,
    ActionIcon 
} from '@mantine/core'

import { useHover }    from '@mantine/hooks'
import { extractType } from '../../../../../lib'

import { 
    TbDots,
    TbSettings,
    TbTrash,
    TbCloudUpload 
} from 'react-icons/tb'

import ProjectModal from './modals/project-modal'

const Project = ({ title, type, id }) => {
    const [opened, setOpened]         = useState(false)
    const [modalState, setModalState] = useState("update")

    let projectInfo        = extractType(type)
    const { hovered, ref } = useHover()

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

    return (
        <Box>
            <ProjectModal 
                opened={opened}
                setOpened={setOpened}
                modalState={modalState}
                id={id}
                title={title}
            />

            <Card
                shadow={"md"}
                p={"md"}
                component={"a"}
                href={"#"}
                radius={"md"}
                ref={ref}
                sx={{ overflow: 'visible' }}

                onDoubleClick={() => { OpenProject() }}
            >
                <Card.Section
                    sx={(theme) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 175,
                        backgroundColor: theme.colors.dark[9],
                    })}
                >
                    <Box
                        sx={{
                            transition: 'transform 300ms ease',
                            transform: `scale(${hovered ? 1.2 : 1})`
                        }}
                    >
                        {React.cloneElement(projectInfo['icon'], { size: 72 })}
                    </Box>
                </Card.Section>
                
                <Card.Section
                    p={"md"}
                    sx={(theme) => ({
                        backgroundColor: theme.colors.dark[6],
                    })}
                >
                    <Title order={3}>{title}</Title>
                    
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text
                            color='dimmed'
                            size={"sm"}
                            transform={"uppercase"}
                        >
                            {type} Project
                        </Text>

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
                    </Box>
                </Card.Section>
            </Card>
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
import React from 'react'

import { 
    Box,
    Text,
    SimpleGrid,
    Card,
    Title 
} from '@mantine/core'

import { useHover }    from '@mantine/hooks'
import { extractType } from '../../../../lib'

const Project = ({ title, type }) => {
    let projectInfo = extractType(type)
    const { hovered, ref } = useHover()

    return (
        <Card
            shadow={"md"}
            p={"md"}
            component={"a"}
            href={"#"}
            radius={"md"}
            ref={ref}
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
                <Text
                    color='dimmed'
                    size={"sm"}
                    transform={"uppercase"}
                >
                    {type} Project
                </Text>
            </Card.Section>
        </Card>
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
                        type={step.project_type}
                    />
                ))}
            </SimpleGrid>
        </Box>
    )
}

export default Projects
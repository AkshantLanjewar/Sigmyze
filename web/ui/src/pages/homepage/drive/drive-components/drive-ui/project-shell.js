import React from 'react'

import { 
    Card,
    Title,
    Box,
    Text 
} from '@mantine/core'

import { useHover }    from '@mantine/hooks'

const ProjectShell = (props) => {
    //props
    let dblClick = props.dblClick
    let title    = props.title
    let type     = props.type
    let menu     = props.menu
    let icon     = props.icon

    const { hovered, ref } = useHover()

    return (
        <Card
            shadow={"md"}
            p={"md"}
            component={"a"}
            href={"#"}
            sx={{ overflow: 'visible' }}
            radius={"md"}

            ref={ref}
            onDoubleClick={() => { dblClick() }}
        >
            <Card.Section
                
                sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 175,
                    backgroundColor: theme.colors.dark[9],
                    borderTopRightRadius: theme.radius.md,
                    borderTopLeftRadius: theme.radius.md
                })}
            >
                <Box
                    sx={{
                        transition: 'transform 300ms ease',
                        transform: `scale(${hovered ? 1.2 : 1})`
                    }}
                >
                    {icon !== undefined && React.cloneElement(icon, { size: 72 })}
                </Box>
            </Card.Section>

            <Card.Section
                p={"md"}
                sx={(theme) => ({
                    backgroundColor: theme.colors.dark[6],
                    borderBottomRightRadius: theme.radius.md,
                    borderBottomLeftRadius: theme.radius.md
                })}
            >
                <Title order={3} mb={'xs'}>{title}</Title>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Text
                        color='dimmed'
                        size={"sm"}
                        transform={"uppercase"}
                    >
                        {type}
                    </Text>

                    {menu}
                </Box>
            </Card.Section>
        </Card>
    )
}

export default ProjectShell
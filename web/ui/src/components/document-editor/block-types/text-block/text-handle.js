import React, { useState } from 'react'

import { 
    Box, 
    ActionIcon, 
    Menu,
    Group,
    Tooltip 
} from '@mantine/core'

import align_templates             from '../align-template'
import { BiDotsHorizontalRounded } from 'react-icons/bi'

const TextHandle = ({ focused, updateAlign }) => {
    const [aligns, setAlign] = useState(align_templates)

    function SetAlign(justify) {
        let n_aligns = []
        for(let i = 0; i < aligns.length; i++) {
            let align    = aligns[i]
            align.active = false

            if(align.justify == justify)
                align.active = true
            n_aligns.push(align)
        }

        updateAlign(justify)
        setAlign([...n_aligns])
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: -10,
                right: -10,
                zIndex: 20,

                display: focused ? 'flex' : 'none'
            }}
        >
            <Menu
                shadow={"md"}
                position={"right-start"}
                withArrow
                width={170}
            >
                <Menu.Target>
                    <ActionIcon
                        color={"gray"}
                        variant={"filled"}
                    >
                        <BiDotsHorizontalRounded size={14} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label sx={{ textAlign: 'center' }}>Text Alignment</Menu.Label>

                    <Group 
                        position={'center'}
                        pt={"xs"}
                        pb={"xs"}
                    >
                        {aligns.map((step, i) => (
                            <Tooltip
                                label={step.name}
                                withArrow
                                position={step.position}
                                key={`${i}-align-text`}
                            >
                                <ActionIcon
                                    color={"dark"}
                                    variant={"filled"}
                                    onClick={() => { SetAlign(step.justify) }}
                                    sx={(theme) => ({ backgroundColor: step.active ? theme.colors.dark[9] : theme.colors.dark[8] })}
                                >
                                    {step.icon}
                                </ActionIcon>
                            </Tooltip>
                        ))}
                    </Group>
                </Menu.Dropdown>
            </Menu>
        </Box>
    )
}

export default TextHandle
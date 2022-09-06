import React, { useState } from 'react'

import { 
    Menu, 
    ActionIcon,
    Group,
    Tooltip 
} from '@mantine/core'

import align_templates from './align-template'

import { IoIosCreate }              from 'react-icons/io'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'

const MultimediaMenu = ({ block, opened, setMenuOpened, icon, sx, size, color, variant, radius, name, setJustify, CreateBlock, DeleteBlock, EditBlock }) => {
    const [positions, setPositions] = useState(align_templates)

    function SetPosition(justify) {
        let n_positions = []
        for(let i = 0; i < positions.length; i++) {
            let position       = positions[i]
            position['active'] = false
            if(position['justify'] == justify)
                position['active'] = true

            n_positions.push(position)
        }

        setPositions([...n_positions])
        setMenuOpened(false)
        setJustify(justify)
    }

    function BlockCommand(command) {
        let id = block.id

        if(command == "create")
            CreateBlock(id)
        if(command == "delete")
            DeleteBlock(id)
        if(command == "edit")
            EditBlock()
    }

    return (
        <Menu
            position={"right-start"}
            width={200}
            withArrow
            shadow={"md"}
            opened={opened}
            onChange={setMenuOpened}
        >
            <Menu.Target>
                <ActionIcon
                    sx={sx}
                    size={size}
                    color={color}
                    variant={variant}
                    radius={radius}
                    onClick={() => { setMenuOpened(!opened) }}
                >
                    {icon}
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown sx={(theme) => ({ backgroundColor: theme.colors.dark[7] })}>
                <Group 
                    position='center'
                    mb={"sm"}
                    mt={"sm"}
                >
                    {positions.map((step, i) => (
                        <Tooltip
                            label={step.name}
                            withArrow
                            position={step.position}
                            key={`${i}-${name}-align`}
                        >
                            <ActionIcon
                                color={"dark"}
                                variant={"filled"}
                                onClick={() => { SetPosition(step.justify) }}
                            >
                                {step.icon}
                            </ActionIcon>
                        </Tooltip>
                    ))}
                </Group>

                <Menu.Item
                    icon={<IoIosCreate size={14} />}
                    onClick={() => { BlockCommand("create") }}
                >
                    Insert new Block
                </Menu.Item>

                <Menu.Item
                    icon={<AiFillEdit size={14} />}
                    onClick={() => { BlockCommand("edit") }}
                >
                    Edit Block
                </Menu.Item>

                <Menu.Item
                    icon={<AiFillDelete size={14} />}
                    onClick={() => { BlockCommand("delete") }}
                >
                    Delete Block
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

export default MultimediaMenu
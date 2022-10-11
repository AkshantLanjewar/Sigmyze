import React, { useState } from 'react'

import ResizeableImage from './image-resizeable'

import { 
    ActionIcon,
    Box,
    Menu,
    Group,
    Tooltip,
    useMantineTheme 
} from '@mantine/core'

import { useHover } from '@mantine/hooks'

import { BiDotsHorizontalRounded }                 from 'react-icons/bi'
import { IoIosCreate }                             from 'react-icons/io'
import { AiFillEdit, AiFillDelete }                from 'react-icons/ai'

import align_templates from '../align-template'

const ImageView = ({ maxWidth, block, setJustify, CreateBlock, DeleteBlock, EditImage, size, setSize, SetAspectWidth }) => {
    const { hovered, ref }            = useHover()
    const [menuActive, setMenuActive] = useState(false)
    const [positions, setPositions]   = useState(align_templates)
    const theme                       = useMantineTheme()

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
        setMenuActive(false)
        setJustify(justify)
    }

    function BlockCommand(command) {
        let id = block.id
        
        if(command == "create")
            CreateBlock(id)
        if(command == "delete")
            DeleteBlock(id)
        if(command == "edit")
            EditImage()
    }

    return (
        <Box
            sx={{ position: 'relative' }}
            pt={"xs"}
            pb={"xs"}
            ref={ref}
        >
            <Menu 
                shadow={"md"}
                opened={menuActive}
                onChange={setMenuActive}
                position={"right-start"}
                width={200}
                withArrow
            >
                <Menu.Target>
                    <ActionIcon
                        sx={{
                            position: 'absolute',
                            right: 0,
                            zIndex: 10,
                            opacity: hovered ? 1 : 0
                        }}
                        
                        size={"lg"}
                        color={"gray"}
                        variant={"transparent"}
                        radius={"xs"}
                        onClick={() => { setMenuActive(!menuActive) }}
                    >
                        <BiDotsHorizontalRounded 
                            size={24} 
                            color={theme.colors.dark[9]}
                            style={{ mixBlendMode: 'difference' }}
                        />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown sx={(theme) => ({ backgroundColor: theme.colors.dark[7] })}>
                    <Group 
                        position={"center"}
                        mb={"sm"}
                        mt={"sm"}
                    >
                        {positions.map((step, i) => (
                            <Tooltip
                                label={step.name}
                                withArrow
                                position={step.position}
                                key={`${i}-align`}
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
                        Edit Image
                    </Menu.Item>
                    <Menu.Item 
                        icon={<AiFillDelete size={14} />}
                        onClick={() => { BlockCommand("delete") }}
                    >
                        Delete Image
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            <ResizeableImage 
                src={block.data.image_data} 
                hovered={hovered} 
                maxWidth={maxWidth}
                SetAspectWidth={SetAspectWidth}
                size={size}
                setSize={setSize}
            />
        </Box>
    )
}

export default ImageView
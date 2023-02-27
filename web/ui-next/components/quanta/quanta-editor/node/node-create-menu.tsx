import { ActionIcon, Group, Menu, Stack, Text, ThemeIcon } from "@mantine/core"
import { IconPlus } from "@tabler/icons"
import React, { cloneElement } from "react"
import { useEffect, useState } from "react"
import { IQuantaNodeDetails, IQuantaSocket } from "../types"
import { DetailedCreateList } from "../utils"
import styles from './node-renderer.module.scss'

interface INodeCreateMenu {
    focused: boolean,
    output: IQuantaSocket,
    unfocus: () => void
}

const NodeCreateMenu: React.FC<INodeCreateMenu> = ({ focused, output, unfocus }) => {
    const [opened, setOpened] = useState(false)
    const [menuItems, setMenuItems] = useState<IQuantaNodeDetails[]>([])

    useEffect(() => {
        if(focused === false)
            setOpened(false)
    }, [focused])

    useEffect(() => {
        if(opened === false)
            return

        let nMenuItems = DetailedCreateList(output.type!)
        setMenuItems([ ...nMenuItems ])
    }, [opened])
    
    return (
        <>
            <Menu
                width={200}
                position={'right-start'}
                withArrow
                opened={opened}
                onClose={() => setOpened(false)}
            >
                <Menu.Target>
                    <ActionIcon
                        color={"dark"}
                        variant={"filled"}
                        radius={"md"}
                        className={styles.add__button}
                        onClick={() => setOpened(true)}
                    >
                        <IconPlus size={14} stroke={"2"} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    {menuItems.map((step) => (
                        <Menu.Item 
                            onClick={() => { 
                                unfocus() 
                            }}
                        >
                            <Group 
                                spacing={"sm"}
                                noWrap
                                sx={{ alignItems: 'normal' }}
                            >
                                <ThemeIcon 
                                    variant={"filled"}
                                    color={"violet"}
                                >
                                    {cloneElement(step.icon, { size: 14 })}
                                </ThemeIcon>

                                <Stack spacing={2.5}>
                                    <Text 
                                        size={"sm"}
                                        weight={"bold"}
                                        sx={{ lineHeight: 1 }}
                                    >
                                        {step.name}
                                    </Text> 

                                    <Text size={8}>
                                        {step.description}
                                    </Text>
                                </Stack>
                            </Group>
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
        </>
    )
}

export default NodeCreateMenu
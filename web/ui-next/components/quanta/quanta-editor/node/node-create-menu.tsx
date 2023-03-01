import { ActionIcon, Group, Menu, Stack, Text, ThemeIcon } from "@mantine/core"
import { IconPlus } from "@tabler/icons"
import React, { cloneElement, RefObject, useContext } from "react"
import { useEffect, useState } from "react"
import { QuantaEditorContext } from "../quanta-editor"
import { IQuantaEditorGlobals, IQuantaNodeDetails, IQuantaSocket } from "../types"
import { DetailedCreateList } from "../utils"
import styles from './node-renderer.module.scss'

interface INodeCreateMenu {
    focused: boolean,
    nodeId?: string,
    handleRef: RefObject<HTMLElement>
    output: IQuantaSocket,
    unfocus: () => void
}

const NodeCreateMenu: React.FC<INodeCreateMenu> = ({ focused, nodeId, output, handleRef, unfocus }) => {
    const [opened, setOpened] = useState(false)
    const [menuItems, setMenuItems] = useState<IQuantaNodeDetails[]>([])

    const quantaEditorContext = useContext(QuantaEditorContext) as IQuantaEditorGlobals | null

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

    function menuClick(type: string) {
        let createMenuFunc = quantaEditorContext?.createNode
        if(createMenuFunc === undefined)
            return
        if(nodeId === undefined)
            return

        createMenuFunc(nodeId, output.socketId!, type, handleRef)
    }
    
    return (
        <>
            <Menu
                width={200}
                position={'right-start'}
                withArrow
                opened={opened}
                onClose={() => setOpened(false)}
            >
                <Menu.Target ref={handleRef}>
                    <ActionIcon
                        color={"dark"}
                        variant={"filled"}
                        radius={"md"}
                        className={`${styles.add__button} ${focused && styles.active}`}
                        onClick={() => setOpened(true)}
                    >
                        <IconPlus size={14} stroke={"2"} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    {menuItems.map((step) => (
                        <Menu.Item 
                            onClick={() => menuClick(step.instructionId)}
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
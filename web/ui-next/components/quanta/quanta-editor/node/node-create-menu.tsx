import { ActionIcon, Group, Menu, Stack, Text, ThemeIcon } from "@mantine/core"
import { IconBrackets, IconPlus } from "@tabler/icons"
import React, { cloneElement, RefObject, useContext } from "react"
import { useEffect, useState } from "react"
import { QuantaEditorContext } from "../quanta-editor"
import { IQuantaEditorGlobals, IQuantaNodeDetails, IQuantaSocket } from "../types/types"
import { DetailedCreateList } from "../utils"
import styles from './node-renderer.module.scss'

interface INodeCreateMenuInner {
    onClick: Function,
    name: string,
    description: string,
    icon: JSX.Element
}

const NodeCreateMenuInner: React.FC<INodeCreateMenuInner> = ({ onClick, name, description, icon }) => {
    return (
        <Menu.Item onClick={() => { onClick() }}>
            <Group 
                spacing={"sm"}
                noWrap
                sx={{ alignItems: 'normal' }}
            >
                <ThemeIcon 
                    variant={"filled"}
                    color={"violet"}
                >
                    {cloneElement(icon, { size: 14 })}
                </ThemeIcon>

                <Stack spacing={2.5}>
                    <Text 
                        size={"sm"}
                        weight={"bold"}
                        sx={{ lineHeight: 1 }}
                    >
                        {name}
                    </Text>

                        <Text size={8}>
                        {description}
                    </Text>
                </Stack>
            </Group>
        </Menu.Item>
    )
}

interface INodeCreateMenu {
    focused: boolean,
    nodeId?: string,
    handleRef: RefObject<HTMLElement>
    output: IQuantaSocket,
    unfocus: () => void,
    parentId?: string
}

const NodeCreateMenu: React.FC<INodeCreateMenu> = ({ focused, nodeId, output, handleRef, unfocus, parentId }) => {
    const [opened, setOpened] = useState(false)
    const [menuItems, setMenuItems] = useState<IQuantaNodeDetails[]>([])

    const { createNode, createIter, editorType } = useContext(QuantaEditorContext) as IQuantaEditorGlobals 

    useEffect(() => {
        if(focused === false)
            setOpened(false)
    }, [focused])

    useEffect(() => {
        if(opened === false)
            return

        let nMenuItems = DetailedCreateList(output.type!, editorType)
        setMenuItems([ ...nMenuItems ])
    }, [opened])

    function menuClick(type: string) {
        let createMenuFunc = createNode
        if(createMenuFunc === undefined)
            return
        if(nodeId === undefined)
            return

        createMenuFunc(nodeId, output.socketId!, type, handleRef, parentId)
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
                    {output.isArray
                        ? (
                            <NodeCreateMenuInner
                                onClick={() => createIter(nodeId!, output.socketId!, handleRef)}
                                name={"Iterate"}
                                description={"Iterate through an array."}
                                icon={(
                                    <IconBrackets 
                                        size={14} 
                                        stroke={2}
                                    />
                                )}
                            />
                        )
                        : menuItems.map((step) => (
                            <NodeCreateMenuInner
                                onClick={() => menuClick(step.instructionId)}
                                name={step.name}
                                description={step.description}
                                icon={step.icon}
                            />
                        ))
                    }
                </Menu.Dropdown>
            </Menu>
        </>
    )
}

export default NodeCreateMenu
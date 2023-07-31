import styles from './node.module.scss'
import { ITreeNode } from './tree'
import { v4 as uuid } from 'uuid'

import { 
    Menu,
    Item,
    Separator,
    useContextMenu 
} from 'react-contexify'

import { 
    IconAdjustments,
    IconAtom2,
    IconBinaryTree2,
    IconChevronDown,
    IconChevronRight,
    IconCodeDots,
    IconShadow,
} from '@tabler/icons'

import { 
    FcFolder, 
    FcComboChart,
    FcDocument,
    FcOpenedFolder 
} from 'react-icons/fc'

import { useHover, usePrevious } from '@mantine/hooks'
import { useState, useEffect } from 'react'
import { Collapse, Text, Tooltip, ActionIcon, Group } from '@mantine/core'

import "react-contexify/dist/ReactContexify.css"

const icon_table = {
    "chart": <FcComboChart size={18} stroke={"2"} />,
    "project": <FcFolder size={18} stroke={"2"} />,
    "project_opened": <FcOpenedFolder size={18} stroke={"2"} />,
    "folder_opened": <FcOpenedFolder size={18} stroke={"2"} />,
    "folder": <FcFolder size={18} stroke={"2"} />,
    "document": <FcDocument size={18} stroke={"2"} />,
    "overview": <IconShadow size={18} stroke={"2"} />,
    "node_editor": <IconBinaryTree2 size={18} stroke={"2"} />,
    "selectors": <IconAdjustments size={18} stroke={"2"} />,
    "dataset": <IconAtom2 size={18} stroke={"2"} />,
    "code::selector": <IconCodeDots size={18} stroke={2} />
}

interface INodeProps {
    node: ITreeNode,
    additional_padding: number,
    root?: boolean,
    setActive?: (id: string, type: string) => void,
    openParent?: () => void
}

const Node: React.FC<INodeProps> = ({ node, additional_padding, root, setActive, openParent }): JSX.Element => {
    const [active, setActiveState] = useState(node.opened ? node.opened : false)
    const [nodeUiId, setId] = useState<string>("")
    const { hovered, ref } = useHover()

    useEffect(() => {
        setId(uuid())
    }, [])

    useEffect(() => {
        if(node.node_type === "chart") {
            if(node.active === true && node.children.length > 0)
                setActiveState(true)
            else
                setActiveState(false)
        }
    }, [node])

    useEffect(() => {
        if(node.active !== true)
            return
        if(openParent === undefined)
            return
        
        openParent()
    }, [node.active])

    function OpenParent() {
        setActiveState(true)
    }

    const { show } = useContextMenu({
        id: nodeUiId
    })

    const needsCaret = node.children.length > 0 || node.node_type === "project"
    const needsPadd  = needsCaret && root === false

    let actions = node.actions
        ? node.actions.map((step) => (
            <Tooltip
                label={step.name}
                position={'bottom-end'}
                color={'black'}
                withArrow
            >
                <ActionIcon
                    value={'side-ico'}
                    onClick={(e) => { 
                        e.stopPropagation()
                        step.cb() 
                    }}
                >
                    {step.icon}
                </ActionIcon>
            </Tooltip>
        ))
        : []

    let box = ( <div className={styles.box}></div> )
    if(node.node_type === "chart" && node.children.length > 0)
        box = ( <div className={`${styles.box} ${styles.show}`}></div> )
    
    let nodeIcon = icon_table[`${node.node_type}` as keyof typeof icon_table]
    if((node.node_type === "project" || node.node_type === "folder") && active)
        nodeIcon = icon_table['folder_opened']

    return (
        <div>
            <div 
                className={`${styles.node} ${node.active ? styles.active : ''}`}
                style={{ paddingLeft: needsPadd ? additional_padding - 2 : additional_padding + 15 }}
                ref={ref}

                onContextMenu={(e) => {
                    if(!node.context)
                        return 
                    
                    if(setActive !== undefined && node.node_type !== 'indicator')
                        setActive(node.node_id, node.node_type)
                    show({ event: e })
                }}

                onClick={(e: any) => {
                    let target = e.target.value
                    let name   = e.target.tagName.toLowerCase()
                    let aria   = e.target.getAttribute('aria-label')

                    if(aria === 'side-ico')
                        return
                    if(target === 'side-ico')
                        return
                    if(node.node_type === 'indicator')
                        return
                    if(name == 'button' || name == 'div' || name == 'svg') {
                        if(node.node_type !== "chart")
                            setActiveState(!active)
                        if(setActive !== undefined)
                            setActive(node.node_id, node.node_type)
                    }
                }}
            >
                <div className={`${styles.title}`}>
                    {node.useActive === false || node.useActive === undefined
                        ? needsCaret && active 
                            ? <IconChevronDown size={18} stroke={2} />
                            : needsCaret
                                ? <IconChevronRight size={18} stroke={2} />
                                : null
                        : null
                    }

                    {box}

                    <div className={`${styles.icon}`}>
                        {nodeIcon}
                    </div>

                    <Text
                        size={"xs"}
                        weight={"bold"}
                        className={styles.text}
                    >
                        {node.node_title}
                    </Text>
                </div>

                {((active || hovered) && node.context === false || node.context === undefined) && (
                    <div className={styles.actions}>
                        {actions}
                    </div>
                )}
            </div>

            <Collapse in={active}>
                {node.children.map((step) => (
                    <Node 
                        node={step}
                        root={false}
                        additional_padding={additional_padding + 18}
                        setActive={setActive}
                        openParent={OpenParent}
                    />
                ))}
            </Collapse>

            <Menu 
                id={nodeUiId}
                theme={"dark"}
                animation={"fade"}
            >
                {node.contextItems?.map((step) => {
                    let type = step.type
                    if(type === "item")
                        return (
                            <Item onClick={() => { step.cb() }}>
                                <Group align={"center"} spacing={"xs"}>
                                    {step.icon}
                                    <Text>{step.name}</Text>
                                </Group>
                            </Item>
                        )
                    else if(type === "divider")
                        return (<Separator />)

                })}
            </Menu>
        </div>
    )
}

export { icon_table }
export default Node
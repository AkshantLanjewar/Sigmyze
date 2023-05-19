import { IExplorerItem } from "../types"
import styles from '../file-explorer.module.scss'
import { Card, Title, Text, Group, UnstyledButton } from "@mantine/core"
import { IconAtom2, IconBox, IconSettings, IconTrash } from "@tabler/icons"
import { useEffect, useState } from "react"
import { v4 } from "uuid"

import "react-contexify/dist/ReactContexify.css"

import { 
    Menu as ContextMenu,
    Item,
    useContextMenu 
} from 'react-contexify'
import { useRouter } from "next/router"
import { capitalizeFirstLetter } from "../../data/utils"

interface IDriveProjectProps {
    item: IExplorerItem,
    activeItem: string | null,
    setActiveItem: (id: string | null) => void,
    setModalState: (id: string | null) => void,
    openItem: (id: string, type?: string) => void
}

const DriveProject: React.FC<IDriveProjectProps> = ({ item, activeItem, setActiveItem, setModalState, openItem }) => {
    const [menuId, setMenuId] = useState("")
    const router = useRouter()

    useEffect(() => {
        setMenuId(v4())
    }, [])

    const { show } = useContextMenu({
        id: menuId
    })

    let projectIcon = <IconBox />
    if(item.item_type === "quanta_project")
        projectIcon = <IconAtom2 />

    let projectType = "Quanta Project"
    if(item.item_type !== null) {
        projectType = ""
        let typeSplit = item.item_type.split("_")
        for(let i = 0; i < typeSplit.length; i++)
            projectType += `${capitalizeFirstLetter(typeSplit[i])} `
    }

    return (
        <>
            <div 
                className={styles.file}
                onClick={() => { setActiveItem(item.item_id) }}
                onDoubleClick={() => { 
                    if(item.item_type === "lunar_project")
                        openItem(item.item_id)
                    if(item.item_type === "quanta_project")
                        openItem(item.item_id, "quanta")
                }}
                onContextMenu={(e) => {
                    setActiveItem(item.item_id)
                    show({ event: e })
                }}
            >
                <Card
                    component={"a"}
                    shadow={"md"}
                    href={"#"}
                    radius={"md"}
                    className={styles.file}
                >
                    <Card.Section className={styles.icon}>
                        <div className={styles.inner}>
                            {projectIcon}
                        </div>
                    </Card.Section>

                    <Card.Section className={`${styles.title} ${activeItem === item.item_id && styles.active}`}>
                        <Title order={4} mb={'xs'}>{item.item_name}</Title>
                        <Text
                            color='dimmed'
                            size={"xs"}
                            transform={"uppercase"}
                            className={styles.subtitle}
                        >
                            {projectType}
                        </Text>
                    </Card.Section>
                </Card>
            </div>

            <ContextMenu
                id={menuId}
                theme={"dark"}
                animation={"scale"}
                style={{ pointerEvents: 'auto' }}
            >
                <Item onClick={() => { setModalState("settings") }}>
                    <Group align={"center"} spacing={"xs"}>
                        <IconSettings size={18} />
                        <Text>Settings</Text>
                    </Group>
                </Item>

                <Item onClick={() => { setModalState("delete") }}>
                    <Group align={"center"} spacing={"xs"}>
                        <IconTrash color="#ff6b6b" size={18} />
                        <Text>Remove</Text>
                    </Group>
                </Item>
            </ContextMenu>
        </>
    )
}

export default DriveProject
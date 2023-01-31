import { IExplorerItem } from "../types"
import styles from '../file-explorer.module.scss'
import { Card, Title, Text, Group, UnstyledButton } from "@mantine/core"
import { IconBox, IconSettings, IconTrash } from "@tabler/icons"
import { useEffect, useState } from "react"
import { v4 } from "uuid"

import "react-contexify/dist/ReactContexify.css"

import { 
    Menu as ContextMenu,
    Item,
    useContextMenu 
} from 'react-contexify'

interface IDriveProjectProps {
    item: IExplorerItem,
    activeItem: string | null,
    setActiveItem: (id: string | null) => void,
    setModalState: (id: string | null) => void
}

const DriveProject: React.FC<IDriveProjectProps> = ({ item, activeItem, setActiveItem, setModalState }) => {
    const [menuId, setMenuId] = useState("")

    useEffect(() => {
        setMenuId(v4())
    }, [])

    const { show } = useContextMenu({
        id: menuId
    })

    return (
        <>
            <div 
                className={styles.file}
                onClick={() => { setActiveItem(item.item_id) }}
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
                            <IconBox />
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
                            Lunar Project
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
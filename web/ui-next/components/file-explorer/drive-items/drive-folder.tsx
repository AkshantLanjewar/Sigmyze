import { Group, Title, Text } from '@mantine/core'
import { IconFolder, IconSettings, IconTrash } from '@tabler/icons'
import { useState, useEffect } from 'react'
import { Menu as ContextMenu, Item, useContextMenu } from 'react-contexify'
import { v4 } from 'uuid'
import styles from '../file-explorer.module.scss'
import { IExplorerFolder } from '../types'

interface IDriveFolderProps {
    folder: IExplorerFolder,
    activeItem: string | null,
    setActiveItem: (id: string | null) => void,
    setActiveDirectory: (id: string) => void,
    setModalState: (id: string | null) => void
}

const DriveFolder: React.FC<IDriveFolderProps> = 
({ folder, activeItem, setActiveItem, setActiveDirectory, setModalState }) => {
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
                onClick={() => { setActiveItem(folder.folder_id) }}
                onDoubleClick={() => { setActiveDirectory(folder.folder_id) }}
                className={`${styles.folder} ${activeItem === folder.folder_id && styles.active}`}
                onContextMenu={(e) => {
                    setActiveItem(folder.folder_id)
                    show({ event: e })
                }}
            >
                <IconFolder size={22} />
                <Title order={5} className={styles.title}>{folder.folder_name}</Title>
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

export default DriveFolder
import styles from './slash-menu.module.scss'
import { UnstyledButton, Group, Text } from '@mantine/core'
import { IDocumentMenuItem } from '../../../data/lunar/types/document-types'
import { useEffect } from 'react'
import React from 'react'

interface ISlashMenuItemProps {
    menuItem: IDocumentMenuItem,
    active: boolean,
    index: number,
    setItemActive: (index: number) => void
}

const SlashMenuItem: React.FC<ISlashMenuItemProps> = (props) => {
    const { menuItem, active, index, setItemActive } = props
    const tRef = React.createRef<HTMLButtonElement>()

    useEffect(() => {
        if(active === false)
            return
        if(tRef.current === null)
            return

        tRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        })
    }, [active])

    return (
        <UnstyledButton
            p={"sm"}
            className={`${styles.item} ${active && styles.active}`}
            ref={tRef}
            onClick={() => { setItemActive(index) }}
        >
            <Group 
                align={"center"} 
                position={"apart"}
                spacing={"lg"}
            >
                <Group align={"center"} spacing={5}>
                    {menuItem.icon}

                    <Text>
                        {menuItem.name}
                    </Text>
                </Group>

                <Text
                    transform="uppercase"
                    size={"xs"}
                    color={"dimmed"}
                >
                    ⌘{menuItem.searchId}
                </Text>
            </Group>
        </UnstyledButton>
    )
}

export default SlashMenuItem
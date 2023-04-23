import { Button, Group, MantineSize, Menu, Stack, Text, ThemeIcon } from "@mantine/core"
import { FloatingPosition } from "@mantine/core/lib/Floating"
import { IconChevronDown } from "@tabler/icons"
import React from "react"
import { useEffect, useState } from "react"
import { IUIDropdownItem } from "./types"
import styles from './ui-dropdown.module.scss'

interface IUIDropdownItemProps {
    item: IUIDropdownItem,
    selectItem: (id: string) => void
}

const UIDropdownItem: React.FC<IUIDropdownItemProps> = ({ item, selectItem }) => {
    return (
        <div className={styles.menu__item} onClick={() => selectItem(item.id)}>
            <ThemeIcon
                color={"indigo"}
                variant={"filled"}
                size={'lg'}
            >
                {item.icon}
            </ThemeIcon>

            <div>
                <div className={styles.title}>{item.name}</div>
                <div className={styles.desc}>
                    {item.description}
                </div>
            </div>
        </div>
    )
}

interface IUIDropdownProps {
    size?: MantineSize,
    items?: IUIDropdownItem[],
    value?: string,
    emitChange?: (id: string) => void,
    expand?: boolean,
    radius?: MantineSize,
    position?: FloatingPosition,
    subscribeClose?: boolean,
    disabled?: boolean
}

const UIDropdown: React.FC<IUIDropdownProps> = 
    ({ size, items, value, emitChange, expand, radius, position, subscribeClose, disabled}) => {
    const [opened, setOpened] = useState(false)

    function selectItem(id: string) {
        setOpened(false)

        if(emitChange === undefined)
            return
        emitChange(id)
    }

    let displayNode = null
    if(items !== undefined) {
        for(let i = 0; i < items.length; i++) {
            let item_ = items[i]
            if(item_.id === value)
                displayNode = item_
        }
    }

    let radiusVal: MantineSize = "xl"
    if(radius !== undefined)
        radiusVal = radius

    let positionVal: FloatingPosition = "bottom-end"
    if(position !== undefined)
        positionVal = position

    useEffect(() => {
        if(subscribeClose === undefined)
            return
            
        setOpened(false)
    }, [subscribeClose])

    useEffect(() => {
        if(opened === true && disabled === true)
            setOpened(false)
    }, [opened, disabled])

    return (
        <>
            <Menu
                opened={opened}
                onOpen={() => setOpened(true)}
                onClose={() => setOpened(false)}
                radius={"md"}
                withArrow
                position={positionVal}
            >
                <Menu.Target>
                    <Button
                        radius={radiusVal}
                        size={size}
                        compact={expand ? false : true}
                        color={"indigo"}
                    >
                        <Group align={"center"} spacing={10}>
                            <Group spacing={2.5}>
                                {displayNode && (
                                    <>
                                        {React.cloneElement(displayNode.icon, { size: 18 })}
                                        {displayNode.name}
                                    </>
                                )}
                            </Group>

                            <IconChevronDown 
                                size={14} 
                                stroke={"2"} 
                                className={`${styles.chevron} ${opened && styles.active}`}
                            />
                        </Group>
                    </Button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Stack spacing={"sm"}>
                        {items?.map((step) => (
                            <UIDropdownItem item={step} selectItem={selectItem} />
                        ))}
                    </Stack>
                </Menu.Dropdown>
            </Menu>
        </>
    )
}

export default UIDropdown
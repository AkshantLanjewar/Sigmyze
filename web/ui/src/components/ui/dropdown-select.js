import React, { useState, useEffect } from 'react'

import { 
    Menu,
    UnstyledButton,
    Group 
} from '@mantine/core'

import { TbCaretDown } from 'react-icons/tb'

const DropdownSelect = ({ u_width, radius, items, selectedIcon, selectedName }) => {
    const [opened, setOpened] = useState(false)
    const [width, setWidth]   = useState(75)

    useEffect(() => {
        if(u_width !== undefined)
            setWidth(u_width)
    }, [])

    return (
        <Menu
            opened={opened}
            radius={radius}
            width={"target"}
            onOpen={() => { setOpened(true) }}
            onClose={() => { setOpened(false) }}
        >
            <Menu.Target>
                <UnstyledButton
                    sx={(theme) => ({
                        display: 'flex',
                        width: `${width}%`,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 15px',
                        borderRadius: theme.radius.md,
                        border: `1px solid ${theme.colors.dark[6]}`,
                        transition: 'background-color 150ms ease',
                        margin: `${theme.spacing.md}px auto`,

                        '&:hover': {
                            backgroundColor: theme.colors.dark[5]
                        }
                    })}
                >
                    <Group spacing={"xs"}>
                        {selectedIcon}

                        <span 
                            style={{ 
                                fontWeight: 500,
                                fontSize: 18
                            }}
                        >
                            {selectedName}
                        </span>
                    </Group>

                    <TbCaretDown size={16} />
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown sx={(theme) => ({ backgroundColor: theme.colors.dark[7] })}>
                {items}
            </Menu.Dropdown>
        </Menu>
    )
}

export default DropdownSelect
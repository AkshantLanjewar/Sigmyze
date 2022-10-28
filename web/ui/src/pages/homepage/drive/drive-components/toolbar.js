import React, { useState, useEffect } from 'react'

import { 
    Box, 
    Breadcrumbs, 
    Button,
    Menu,
    UnstyledButton,
    Group
} from '@mantine/core'

import { connect }         from 'react-redux'
import { ChangeDirectory } from '../../../../data/actions/driveActions'
import useStyles from "./toolbar.styles"

import { TbCloudUpload, TbChevronDown } from "react-icons/tb"

const NavBox = ({ name, id, SetWorkingDirectory }) => {
    return (
        <Button
            variant={'subtle'}
            color={'teal'}
            onClick={() => { SetWorkingDirectory(id) }}
        >
            {name}
        </Button>
    )
}

const DriveSelector = ({ }) => {
    const [opened, setOpened] = useState(false)
    const [selected, setSelected] = useState(0)
    const [items, setItems] = useState([])
    const { classes } = useStyles(opened)

    return (
        <Menu
            opened={opened}
            onChange={setOpened}
            radius={"sm"}
            withArrow
            width={"target"}
        >
            <Menu.Target>
                <UnstyledButton
                    className={classes.control}
                    sx={(theme) => ({
                        backgroundColor: theme.colors.dark[opened ? 5 : 7]
                    })}
                >
                    <Group spacing={"xs"}>
                        <TbCloudUpload size={22} />
                        <span className={classes.label}>My Drive</span>
                    </Group>

                    <TbChevronDown
                        size={16}
                        className={classes.icon}
                        sx={{
                            transform: opened ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                    />
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    icon={<TbCloudUpload size={18} />}
                >
                    My Drive
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

const DriveToolbar = ({ paths, SetWorkingDirectory }) => {
    return (
        <Box
            p={"md"}
            pb={"xs"}
            mb={"xl"}
            sx={(theme) => ({
                borderBottom: `1px solid ${theme.colors.dark[3]}`
            })}
        >
            <Breadcrumbs>
                <DriveSelector />
                
                {paths.map((step => ( 
                    <NavBox 
                        name={step.name} 
                        id={step.id}
                        SetWorkingDirectory={SetWorkingDirectory}
                    /> 
                )))}
            </Breadcrumbs>
        </Box>
    )
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
    SetWorkingDirectory: (folder_id) => { dispatch(ChangeDirectory(folder_id)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(DriveToolbar)
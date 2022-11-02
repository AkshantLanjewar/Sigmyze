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
import { SetOrganization } from "../../../../data/actions/organizationActions"
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

const DriveSelector = ({ user, SetOrganizationRedux }) => {
    const [opened, setOpened] = useState(false)
    const [selected, setSelected] = useState(null)
    const [items, setItems] = useState([])
    const { classes } = useStyles(opened)

    useEffect(() => {
        let jwtToken = user.jwtToken
        let url = "/api/v1/organizations"

        fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        })
        .then(res => res.json()).then(data => {
            let organizations = data['organizations']

            setItems([...organizations])
            setSelected(organizations[0])

            SetOrganization(organizations[0])
        })
    }, [])

    function SetOrganization(id) {
        let n_selected = null
        for(let i = 0; i < items.length; i++) {
            let item = items[i]
            if(item.organization_id == id)
                n_selected = item
        }

        if(n_selected !== null) {
            SetOrganizationRedux(n_selected['user_organization'], n_selected['organization_id'], n_selected['organization_admin'])
            setSelected({ ...n_selected })
        }
    }

    return (
        <Menu
            opened={opened}
            onChange={setOpened}
            radius={"sm"}
            withArrow
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
                        {selected !== null && (
                            <span className={classes.label}>{selected['organization_name']}</span>
                        )}
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
                {items.map((step) => (
                    <Menu.Item
                        icon={<TbCloudUpload size={18} />}
                        component={"button"}
                        onClick={() => { SetOrganization(step.organization_id) }}
                    >
                        {step.organization_name}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    )
}

const DriveToolbar = ({ user, paths, SetWorkingDirectory, SetOrganization }) => {
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
                <DriveSelector
                    user={user}
                    SetOrganizationRedux={SetOrganization}
                />
                
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
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    SetWorkingDirectory: (folder_id) => { dispatch(ChangeDirectory(folder_id)) },
    SetOrganization: (user_organization, organization_id, organization_admin) => {
        dispatch(SetOrganization(user_organization, organization_id, organization_admin))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(DriveToolbar)
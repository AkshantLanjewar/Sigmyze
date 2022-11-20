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
import { 
    ChangeDirectory,
    ToggleDriveUpdate
} from '../../../../data/actions/driveActions'
import { 
    SetOrganization,
    SetOrganizations 
} from "../../../../data/actions/organizationActions"

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

const DriveSelector = ({ user, drive, ToggleDriveUpdate, SetOrganizations, SetOrganizationRedux }) => {
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
            SetOrganizations(organizations)
        })
    }, [drive.update_drive])

    useEffect(() => {
        if(selected == null && items.length > 0)
            SetOrganization(items[0].organization_id)
        ToggleDriveUpdate()
    }, [items])

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
            ToggleDriveUpdate()
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

const DriveToolbar = ({ user, drive, paths, ToggleDriveUpdate, SetOrganizations, SetWorkingDirectory, SetOrganization }) => {
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
                    drive={drive}
                    ToggleDriveUpdate={ToggleDriveUpdate}
                    SetOrganizations={SetOrganizations}
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
    user: state.user,
    drive: state.drive
})

const mapDispatchToProps = dispatch => ({
    ToggleDriveUpdate: () => { dispatch(ToggleDriveUpdate()) },
    SetOrganizations: (organizations) => { dispatch(SetOrganizations(organizations)) },
    SetWorkingDirectory: (folder_id) => { dispatch(ChangeDirectory(folder_id)) },
    SetOrganization: (user_organization, organization_id, organization_admin) => {
        dispatch(SetOrganization(user_organization, organization_id, organization_admin))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(DriveToolbar)
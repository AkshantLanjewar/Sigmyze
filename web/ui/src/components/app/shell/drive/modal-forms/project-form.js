import React, { useState } from 'react'

import { useForm } from '@mantine/form'
import { 
    TextInput,
    Button,
    Menu,
    UnstyledButton,
    Group 
} from '@mantine/core'

import { SiAzuredataexplorer } from 'react-icons/si'
import { Tb3DCubeSphere      } from 'react-icons/tb'
import { TbChevronDown }       from 'react-icons/tb'

import { connect }           from 'react-redux'
import { ToggleDriveUpdate } from '../../../../../data/actions/driveActions'

const project_items = [
    { icon: <Tb3DCubeSphere size={22} />, name: "Lunar Project" }
]

const ProjectForm = ({ drive, user, toggleUpdateDrive, CloseModal }) => {
    const [opened, setOpened]     = useState(false)
    const [selected, setSelected] = useState(project_items[0])

    const form = useForm({
        projectName: ''
    })

    function OnSubmit(e) {
        e.preventDefault()
        if(form.values.projectName == undefined)
            return

        let working_directory = drive.working_directory
        let project_name      = form.values.projectName
        let project_type      = "lunar"
        let jwt_token         = user.jwtToken

        let post_data = {
            directory: working_directory,
            project_name: project_name,
            project_type: project_type
        }

        fetch("/api/v1/drive/create-project", {
            method: "POST",
            body: JSON.stringify(post_data),

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt_token}`
            },
        })
        .then(res => {
            if(res.status !== 200)
                return
            
            toggleUpdateDrive()
            CloseModal()
        })

        CloseModal()
    }

    const items = project_items.map((item) => (
        <Menu.Item
            icon={item.icon}
            onClick={() => { setSelected(item) }}
            key={`project-type-${item.name}`}
        >
            {item.name}
        </Menu.Item>
    ))

    return (
        <div>
            <form onSubmit={OnSubmit}>
                <TextInput
                    placeholder="Project's name"
                    variant={'filled'}
                    label={'Name'}
                    required
                    icon={<SiAzuredataexplorer size={14} />}
                    {...form.getInputProps('projectName')}
                />

                <Menu
                    onOpen={() => { setOpened(true) }}
                    onClose={() => { setOpened(false) }}
                    radius={"md"}
                    width={"target"}
                >
                    <Menu.Target>
                        <UnstyledButton
                            sx={(theme) => ({
                                display: 'flex',
                                width: "75%",
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
                                {selected.icon}

                                <span 
                                    style={{ 
                                        fontWeight: 500,
                                        fontSize: 18
                                    }}
                                >
                                    {selected.name}
                                </span>
                            </Group>

                            <TbChevronDown size={16}  />
                        </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown sx={(theme) => ({ backgroundColor: theme.colors.dark[7] })}>
                        {items}
                    </Menu.Dropdown>
                </Menu>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Button
                        onClick={OnSubmit}
                        mt={"md"}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    )
}

const mapStateToProps = state => ({
    drive: state.drive,
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    toggleUpdateDrive: () => { dispatch(ToggleDriveUpdate()) }
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm)
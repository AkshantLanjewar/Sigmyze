import React, { useState } from 'react'

import { useForm } from '@mantine/form'
import { 
    TextInput,
    Button,
    Menu,
    UnstyledButton,
    Group 
} from '@mantine/core'

import DropdownSelect from '../../../../components/ui/dropdown-select'

import { SiAzuredataexplorer } from 'react-icons/si'
import { Tb3DCubeSphere      } from 'react-icons/tb'
import { TbChevronDown }       from 'react-icons/tb'

import { connect }           from 'react-redux'
import { ToggleDriveUpdate } from '../../../../data/actions/driveActions'
import { CreateProject } from "../../../../data/backend/drive-operations";

const project_items = [
    { icon: <Tb3DCubeSphere size={22} />, name: "Lunar Project" }
]

const ProjectForm = ({ drive, user, organization, toggleUpdateDrive, CloseModal }) => {
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

        const functions = {
            'CloseModal': CloseModal,
            'toggleUpdateDrive': toggleUpdateDrive
        }

        CreateProject(organization, functions, jwt_token, post_data)
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

                <DropdownSelect
                    radius={"md"}
                    items={items}
                    selectedIcon={selected.icon}
                    selectedName={selected.name}
                />

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
    user: state.user,
    organization: state.organization
})

const mapDispatchToProps = dispatch => ({
    toggleUpdateDrive: () => { dispatch(ToggleDriveUpdate()) }
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm)
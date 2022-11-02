import React, { useEffect } from 'react'

import { TextInput, Button } from '@mantine/core'

import { useForm }           from '@mantine/form'
import { UpdateProject }     from "../../../../../data/backend/drive-operations";
import { ToggleDriveUpdate } from '../../../../../data/actions/driveActions'
import { connect }           from 'react-redux'

const UpdateForm = ({ id, title, drive, user, project, organization, toggleUpdateDrive, setOpened }) => {
    const ref  = React.createRef()
    const form = useForm({
        initialValues: {
            name: title
        }
    })

    useEffect(() => {
        ref.current.value = title
    }, [])

    function Update(e) {
        e.preventDefault()

        let jwt_token   = user.jwtToken
        let url         = '/api/v1/drive/update-project'
        let working_dir = drive.working_directory

        let new_project             = {}
        new_project['project_id']   = id
        new_project['project_type'] = 'lunar'
        new_project['project_name'] = form.values.name
        new_project['project_data'] = project.project_data

        let post = {
            directory: working_dir,
            project_id: id,
            project: new_project
        }

        const functions = { resCompleted: () => {
            toggleUpdateDrive()
            setOpened(false)
        }}

        UpdateProject(organization, functions, jwt_token, post)
    }

    return (
        <div>
            <form onSubmit={Update}>
                <TextInput
                    ref={ref}
                    label={"Project name"}
                    placeholder={"Your project name"}
                    value={form.values.name}
                    onChange={(e) => form.setFieldValue('name', e.currentTarget.value)}
                />

                <Button 
                    onClick={Update}
                    mt={'sm'}
                    sx={{ width: '100%' }}
                    variant={'outline'}
                    color={'red'}
                >
                    Update Project
                </Button>
            </form>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    toggleUpdateDrive: () => { dispatch(ToggleDriveUpdate()) }
})

const mapStateToProps = state => ({
    project: state.project,
    user: state.user,
    drive: state.drive,
    organization: state.organization
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateForm)
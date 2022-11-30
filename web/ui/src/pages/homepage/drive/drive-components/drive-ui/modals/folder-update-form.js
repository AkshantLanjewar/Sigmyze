import React, { useEffect } from 'react'

import { TextInput, Button } from '@mantine/core'

import { useForm }           from '@mantine/form'
import { showNotification }  from '@mantine/notifications'
import { ToggleDriveUpdate } from '../../../../../../data/actions/driveActions'
import { connect }           from 'react-redux'

import { UpdateFolder } from "../../../../../../data/backend/drive-operations"

const UpdateForm = ({ user, drive, organization, id, title, toggleUpdateDrive, GetFolderData, setOpened }) => {
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
        let jwt_token = user.jwtToken

        let n_folder            = {}
        n_folder['folder_name'] = form.values.name
        n_folder['folder_id']   = id

        let post = {
            directory: drive.working_directory,
            folder_id: id,
            folder: n_folder
        }

        const functions = { resCompleted: () => {
            toggleUpdateDrive()
            setOpened(false)
        }}

        UpdateFolder(organization, functions, jwt_token, post)
    }

    return (
        <div>
            <form onSubmit={Update}>
                <TextInput
                    ref={ref}
                    label={"Folder name"}
                    placeholder={"Your folder name"}
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
                    Update Folder
                </Button>
            </form>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    toggleUpdateDrive: () => { dispatch(ToggleDriveUpdate()) }
})

const mapStateToProps = state => ({
    user: state.user,
    drive: state.drive,
    organization: state.organization
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateForm)
import React, { useEffect } from 'react'

import { TextInput, Button } from '@mantine/core'

import { useForm }           from '@mantine/form'
import { showNotification }  from '@mantine/notifications'
import { ToggleDriveUpdate } from '../../../../../../../data/actions/driveActions'
import { connect }           from 'react-redux'

const UpdateForm = ({ user, drive, id, title, toggleUpdateDrive, GetFolderData, setOpened }) => {
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
        
        let folder_data = GetFolderData(drive, id)

        let jwt_token = user.jwtToken
        let url       = "/api/v1/drive/update-folder"

        let n_folder            = {}
        n_folder['folder_name'] = form.values.name
        n_folder['folder_id']   = id
        n_folder['starred']     = "no"
        n_folder['folders']     = folder_data['folders']
        n_folder['projects']    = folder_data['projects']

        let post = {
            directory: drive.working_directory,
            folder_id: id,
            folder: n_folder
        }

        console.log(post)

        fetch(url, {
            method: "POST",
            body: JSON.stringify(post),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt_token}` 
            }
        })
        .then(res => res.json())
        .then(data => {
            toggleUpdateDrive()
            setOpened(false)
        })
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
    drive: state.drive
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateForm)
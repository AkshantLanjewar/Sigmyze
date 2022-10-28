import React from 'react'

import { TextInput, Button } from '@mantine/core'
import { useForm }           from '@mantine/form'

import { AiFillFolderAdd } from 'react-icons/ai'

import { connect }           from 'react-redux'
import { ToggleDriveUpdate } from '../../../../data/actions/driveActions'

const FolderForm = ({ drive, user, toggleUpdateDrive, CloseModal }) => {
    const form = useForm({
        folderName: ''
    })

    function OnSubmit(e) {
        e.preventDefault()

        if(form.values.folderName == undefined)
            return

        let jwt_token   = user.jwtToken
        let folder_name = form.values.folderName
        let post_data   = {
            directory: drive.working_directory,
            folder_name: folder_name
        }

        fetch("/api/v1/drive/create-folder", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt_token}`
            },
            body: JSON.stringify(post_data),
        })
        .then(res => {
            if(res.status !== 200)
                return
            else
            {
                toggleUpdateDrive()
                CloseModal()
            }
        })
    }

    return (
        <div>
            <form onSubmit={OnSubmit}>
                <TextInput
                    placeholder="Folder's Name"
                    variant={'filled'}
                    label={'Name'}
                    required
                    icon={<AiFillFolderAdd size={14} />}
                    {...form.getInputProps('folderName')}
                />

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Button 
                        onClick={OnSubmit}
                        mt={"sm"}
                    >
                        Add
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

export default connect(mapStateToProps, mapDispatchToProps)(FolderForm)
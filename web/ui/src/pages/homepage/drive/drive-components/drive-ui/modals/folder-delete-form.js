import React from 'react'

import { 
    Alert, 
    TextInput, 
    Button,
    Text 
} from '@mantine/core'

import { TbAlertCircle } from 'react-icons/tb'

import { showNotification }  from '@mantine/notifications'
import { connect }           from 'react-redux'
import { ToggleDriveUpdate } from '../../../../../../data/actions/driveActions'

const DeleteForm = ({ drive, user, title, id, setOpened, toggleUpdateDrive }) => {
    const inputRef = React.createRef()

    function Delete(e) {
        e.preventDefault()

        let url = '/api/v1/drive/delete-folder'
        let val = inputRef.current.value

        if(val == undefined || val !== title) {
            showNotification({
                title: 'Folder Delete',
                message: 'Please type out the folder name to confirm you want to delete it',
                color: 'red',
                autoClose: 1000 * 10
            })

            return
        }

        let jwt_token = user.jwtToken
        let directory = drive.working_directory
        let post      = {
            directory: directory,
            directory_id: id
        }

        fetch(url, {
            method: "POST",
            body: JSON.stringify(post),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt_token}`
            }
        })
        .then(res => {
            if(res.status !== 200)
                return

            toggleUpdateDrive()
            setOpened(false)
        })
    }

    return (
        <div>
            <Alert
                icon={<TbAlertCircle size={16} />}
                title={"Warning"}
                color={"yellow"}
            >
                This action <b>cannot</b> be undone. 
                This will permanently delete the <b>{title}</b> folder, projects, and any documents associated with it.
            </Alert>

            <form style={{ marginTop: 18 }} onSubmit={(e) => { Delete(e) }}>
                <Text size={'sm'} sx={{ paddingLeft: 2 }}>Please type the name of the folder to confirm</Text>
                <TextInput
                    sx={{ paddingTop: 5 }}
                    placeholder='Folder name'
                    size={'md'}
                    ref={inputRef}
                />

                <Button 
                    sx={{ width: '100%' }}
                    color={'red'}
                    mt={'sm'}
                    size={'sm'}
                    variant={'outline'}
                    onClick={(e) => { Delete(e) }}
                >
                    I understand the consequences, delete this folder
                </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteForm)
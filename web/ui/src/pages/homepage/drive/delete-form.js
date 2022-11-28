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
import { ToggleDriveUpdate } from '../../../data/actions/driveActions'
import { DeleteItem }        from "../../../data/backend/drive-operations";

const DeleteForm = 
    ({ formType, organization, drive, user, title, article, id, setOpened, toggleUpdateDrive }) => {
    const inputRef = React.createRef()
    let jwt_token  = user.jwtToken

    function DeleteFolder() {
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

        let directory = drive.working_directory
        let post      = {
            directory: directory,
            directory_id: id
        }

        const functions = { resCompleted: () => {
            toggleUpdateDrive()
            setOpened(false)
        }}

        DeleteItem("folder", organization, functions, jwt_token, post)
    }

    function DeleteArticle() {
        let published_id    = article.published_id
        let organization_id = organization.organization_id
        let url             = `/api/v1/organizations/organization/${organization_id}/approve/${published_id}`

        fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${jwt_token}` 
            }
        }).then(data => {
            toggleUpdateDrive()
            setOpened()
        })
    }

    function Delete(e) {
        e.preventDefault()

        if(formType === "folder")
            DeleteFolder()
        if(formType === "article")
            DeleteArticle()
    }

    let placeholder = 'Folder name'
    if(formType === "article")
        placeholder = "Article title"

    return (
        <div>
            <Alert
                icon={<TbAlertCircle size={16} />}
                title={"Warning"}
                color={"yellow"}
            >
                This action <b>cannot</b> be undone. 
                This will permanently delete the {formType} <b>{title}</b>
                {formType === 'folder' && ", projects, and any documents associated with it."}
            </Alert>

            <form style={{ marginTop: 18 }} onSubmit={(e) => { Delete(e) }}>
                <Text size={'sm'} sx={{ paddingLeft: 2 }}>Please type the name of the {formType} to confirm</Text>
                <TextInput
                    sx={{ paddingTop: 5 }}
                    placeholder={placeholder}
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
                    I understand the consequences, delete this {formType}
                </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteForm)
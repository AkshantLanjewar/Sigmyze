import React, { useState, useEffect }  from 'react'

import { 
    Box, 
    Loader, 
    Text 
} from '@mantine/core'

import { connect } from 'react-redux'
import { UpdateProject } from "../../../data/backend/drive-operations";

const Loading = ({ }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,

                cursor: 'pointer'
            }}
        >
            <Loader  size={'xs'} />

            <Text
                transform='uppercase' 
                color={"dimmed"}
                size={'sm'}
                mr={'md'}
            >
                Saving
            </Text>
        </Box>
    )
}

const Default = ({ }) => {
    return (
        <div>
            <Text 
                transform='uppercase' 
                color={"dimmed"}
                size={'sm'}
                mr={'md'}
                sx={{ cursor: 'pointer' }}
            >
                Project Saved
            </Text>
        </div>
    )
}

const SaveController = ({ project, user, drive, organization }) => {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const jwt_token = user.jwtToken
        const u_state   = user.userState
        if(u_state == "signedout" || jwt_token == undefined || project.project_id == 'demo') {
            setLoading(false)
            return
        }

        let working_directory = drive.working_directory
        let project_id        = project.project_id
        let new_project       = {}

        new_project['project_id']   = project.project_id
        new_project['project_type'] = 'lunar'
        new_project['project_name'] = project.project_name
        new_project['project_data'] = project.project_data

        let post = {
            directory: working_directory,
            project_id: project_id,
            project: new_project
        }

        const functions = { resCompleted: () => {
            setLoading(false)
        }}

        setLoading(true)
        UpdateProject(organization, functions, jwt_token, post)
    }, [project])

    return (
        <div>
            {loading == true
                ? <Loading />
                : <Default />
            }
        </div>
    )
}

const mapDispatchToProps = dispatch => ({

})

const mapStateToProps = state => ({
    project: state.project,
    user: state.user,
    drive: state.drive,
    organization: state.organization
})

export default connect(mapStateToProps, mapDispatchToProps)(SaveController)
import React, { useState, useEffect }  from 'react'

import { 
    Box, 
    Loader, 
    Text 
} from '@mantine/core'

import { connect } from 'react-redux'

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

const SaveController = ({ project, user, drive }) => {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        //save the new project
        setLoading(true)
        
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

        fetch("/api/v1/drive/update-project", {
            method: "POST",
            body: JSON.stringify(post),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt_token}` 
            }
        })
        .then(res => res.json())
        .then(data => {
            setLoading(false)
        })
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
    drive: state.drive
})

export default connect(mapStateToProps, mapDispatchToProps)(SaveController)
import React, { useState, useEffect }  from 'react'

import { 
    Box, 
    Loader, 
    Text 
} from '@mantine/core'

import { connect }          from 'react-redux'
import { UpdateProject }    from "../../../data/backend/drive-operations"
import { DehydrateProject } from '../document-hydration'
import { usePrevious }      from '../../../components/lib'

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

const SaveController = ({ contentLoaded, project, user, drive, organization }) => {
    const [loading, setLoading] = useState(false)
    //prev values
    const tabLengthPrev = usePrevious(project.tabs.length)

    useEffect(() => {
        const jwt_token = user.jwtToken
        const u_state   = user.userState
        if(project.project_id == 'demo')
            return
        if(tabLengthPrev !== project.tabs.length)
            return
        
        if((u_state == "signedout" || jwt_token == undefined) && contentLoaded) {
            setLoading(false)
            window.location.replace('/')
            return
        }

        let working_directory = drive.working_directory
        let project_id        = project.project_id
        let new_project       = {}

        new_project['project_id']   = project.project_id
        new_project['project_type'] = 'lunar'
        new_project['project_name'] = project.project_name
        new_project['project_data'] = project.project_data
        new_project                 = DehydrateProject(new_project)

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
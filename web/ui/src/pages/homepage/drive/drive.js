import React, { useState, useEffect } from 'react'

import DriveToolbar  from './drive-components/toolbar'
import DriveView     from './views/drive-view'
import DashboardView from './views/dashboard-view'

import { connect }         from 'react-redux'
import { ChangeDirectory } from '../../../data/actions/driveActions'

import { 
    Box,
    LoadingOverlay 
} from '@mantine/core'

function HasChild(folders, id) {
    for(let i = 0; i < folders.length; i++) {
        let folder = folders[i]
        
        if(folder.folder_id == id)
            return true
        else
            return HasChild(folder.folders, id)
    }

    return false
}

function AddToDirectory(directory, folders, id) {
    let n_directory = directory

    for(let i = 0; i < folders.length; i++) {
        let folder = folders[i]

        if(folder.folder_id == id) {
            directory.push({ name: folder.folder_name, id: folder.folder_id })
            return n_directory
        } else if(HasChild(folder.folders, id)) {
            directory.push({ name: folder.folder_name, id: folder.folder_id })
            n_directory = AddToDirectory(n_directory, folder.folders, id)
        }
    }

    return n_directory
}

function GetWorkingPath(drive, id) {
    let directory = [{ name: "Workspace", id: "root" }]
    let folders   = drive.folders
    directory     = AddToDirectory(directory, folders, id)

    return directory
}

function _GetFolder(folders, id) {
    let n_folders  = []
    let projects = []

    for(let i = 0; i < folders.length; i++) {
        let folder = folders[i]

        if(folder.folder_id == id) {
            n_folders  = folder.folders
            projects   = folder.projects 
        } else {
            let n_obj   = _GetFolder(folder.folders, id)
            n_folders   = n_obj.folders
            projects    = n_obj.projects
        }
    }

    return { folders: n_folders, projects: projects }
}

function GetFolderData(drive, id) {
    let folders  = []
    let projects = []

    if(id == 'root') {
        folders  = drive.folders
        projects = drive.projects
    } else {
        let obj  = _GetFolder(drive.folders, id)
        folders  = obj.folders
        projects = obj.projects
    }

    return { folders: folders, projects: projects }
}

const Drive = ({ changeDirectory, drive, emptyDrive, loading }) => {
    const [projects, setProjects]     = useState(drive.projects)
    const [folders, setFolders]       = useState(drive.folders)
    const [paths, setPaths]           = useState([{ name: "Workspace", id: "root" }])
    const [view, setView]             = useState('drive')

    function SetWorkingDirectory(id) {
        changeDirectory(id)
    }

    useEffect(() => {
        let n_directory = GetWorkingPath(drive, drive.working_directory)
        let n_drive     = GetFolderData(drive, drive.working_directory)

        setProjects([...n_drive.projects])
        setFolders([...n_drive.folders])        
        setPaths([...n_directory])
    }, [drive.working_directory, drive.folders, drive.projects, drive.published_queue])

    return (
        <div>
            <DriveToolbar 
                paths={paths}
                view={view}
                setView={setView}
            />

            <Box sx={{ position: 'relative' }}>
                <LoadingOverlay visible={loading} overlayBlur={2} />

                {view == 'drive' && (
                    <DriveView
                        folders={folders}
                        GetFolderData={GetFolderData}
                        SetWorkingDirectory={SetWorkingDirectory}
                        projects={projects}
                        emptyDrive={emptyDrive}
                    />
                )}

                {view == 'published' && (
                    <DashboardView />
                )}
            </Box>
        </div>
    )
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
    changeDirectory: (folder_id) => { dispatch(ChangeDirectory(folder_id)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Drive)
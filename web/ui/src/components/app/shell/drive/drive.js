import React, { useState, useEffect } from 'react'

import { Box } from '@mantine/core'

import DriveFolders from './drive-components/folders'
import Projects     from './drive-components/projects'
import DriveToolbar from './drive-components/toolbar'
import EmptyDrive   from './drive-components/empty-drive'

import { connect }         from 'react-redux'
import { ChangeDirectory } from '../../../../data/actions/driveActions'

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

const Drive = ({ changeDirectory, drive }) => {
    const [projects, setProjects] = useState(drive.projects)
    const [folders, setFolders]   = useState(drive.folders)
    const [paths, setPaths]       = useState([{ name: "Workspace", id: "root" }])

    function SetWorkingDirectory(id) {
        changeDirectory(id)
    }

    useEffect(() => {
        let n_directory = GetWorkingPath(drive, drive.working_directory)
        let n_drive     = GetFolderData(drive, drive.working_directory)

        setProjects([...n_drive.projects])
        setFolders([...n_drive.folders])        
        setPaths([...n_directory])
    }, [drive.working_directory, drive.folders, drive.projects])

    return (
        <div>
            <DriveToolbar 
                paths={paths} 
                SetWorkingDirectory={SetWorkingDirectory}
            />

            {projects.length == 0 && folders.length == 0
                ? (
                    <Box mt={"xl"}>
                        <EmptyDrive 
                            TitleMSG={"Create a new project or folder to get started"}
                            SubtitleMSG={"Click the new button on the left"}
                        />
                    </Box>
                )

                : (
                    <Box>
                        <DriveFolders 
                            folders={folders} 
                            SetWorkingDirectory={SetWorkingDirectory}
                        />
                        
                        <Projects projects={projects} />
                    </Box>
                )
            }
        </div>
    )
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
    changeDirectory: (folder_id) => { dispatch(ChangeDirectory(folder_id)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Drive)
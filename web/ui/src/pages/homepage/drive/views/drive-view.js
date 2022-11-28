import React from 'react'

import OrganizationQueue from '../drive-components/drive-ui/organization_queue'
import EmptyDrive        from '../drive-components/empty-drive'
import DriveFolders      from '../drive-components/drive-ui/folders'
import Projects          from '../drive-components/drive-ui/projects'

const DriveView = ({ folders, GetFolderData, SetWorkingDirectory, projects, emptyDrive }) => {
    return (
        <div>
            <OrganizationQueue />

            {emptyDrive
                ? (
                    <EmptyDrive 
                        TitleMSG={"Welcome to your Command Center"}
                        SubtitleMSG={"Click on the + New button to get started"}
                    />
                )
                : (
                    <div>
                        <DriveFolders 
                            folders={folders} 
                            GetFolderData={GetFolderData}
                            SetWorkingDirectory={SetWorkingDirectory}
                        />

                        <Projects projects={projects} />
                    </div>
                )
            }
        </div>
    )
}

export default DriveView
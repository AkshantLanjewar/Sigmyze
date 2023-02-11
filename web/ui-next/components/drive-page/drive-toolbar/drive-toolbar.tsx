import { Breadcrumbs, Button, Group, UnstyledButton } from '@mantine/core'
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { OrganizationContextData } from '../../data/organization/context'
import { IDriveFolder, IDriveProject, IDriveResp, IOrganization, IOrganizationController } from '../../data/organization/types'
import DriveSelector from '../drive-selector/drive-selector'
import styles from './drive-toolbar.module.scss'
import selectorStyles from '../drive-selector/drive-selector.module.scss'
import { GetProjectElement, GetWorkingPaths } from './functions'
import { IconChevronRight, IconFileShredder } from '@tabler/icons'
import DriveActionMenu from '../drive-action-menu/drive-action-menu'

interface IToolbarBreadcrumb {
    directory_name: string,
    directory_id: string
}

interface IDriveToolbarProps {
    driveData: IDriveResp | null,
    modalState: string | null,
    setModalState: Dispatch<SetStateAction<string | null>>
}

const DriveToolbar: React.FC<IDriveToolbarProps> = ({ driveData, modalState, setModalState }) => {
    const { 
        activeDirectory, 
        setActiveDirectory,
        organizations,
        selectedOrganization,
        selectedDriveId 
    } = useContext(OrganizationContextData) as IOrganizationController

    const [breadcrumbs, setBreadcrumbs] = useState<IToolbarBreadcrumb[]>([])
    const [organizationBlock, setOrganizationBlock] = useState<IOrganization>({} as IOrganization)
    const [actionMenu, setActionMenu] = useState<string | null>(null)

    //NOTE: data for the action menu
    const [selectedFolder, setSelectedFolder] = useState<IDriveFolder | null>(null)
    const [selectedProject, setSelectedProject] = useState<IDriveProject | null>(null)

    useEffect(() => {
        if(driveData === null)
            return

        let paths = GetWorkingPaths(driveData, activeDirectory)
        setBreadcrumbs([ ...paths ])
    }, [activeDirectory])

    useEffect(() => {
        if(selectedOrganization === null)
            return
        if(organizations === undefined)
            return

        let selectedOrganizationBlock = organizations[0]
        for(let i = 0; i < organizations.length; i++) {
            let organization = organizations[i]
            if(organization.organization_id === selectedOrganization)
                selectedOrganizationBlock = organization
        }

        setOrganizationBlock({ ...selectedOrganizationBlock })
    }, [selectedOrganization])

    useEffect(() => {
        if(driveData === null)
            return
        if(selectedDriveId === null) {
            setActionMenu(null)
            return
        }

        let selectedElement = GetProjectElement(driveData, selectedDriveId)
        if(selectedElement === null)
            return
        
        setSelectedFolder(null)
        setSelectedProject(null)

        let pFolder = selectedElement as IDriveFolder
        if(pFolder.folder_id !== undefined) {
            setActionMenu("folder")
            setSelectedFolder({ ...pFolder })
        }

        let pProject = selectedElement as IDriveProject
        if(pProject.project_id !== undefined) {
            setActionMenu("project")
            setSelectedProject({ ...pProject })
        }
    }, [selectedDriveId])

    return (
        <div className={styles.toolbarWrapper}>
            <Group style={{ width: '100%' }}>
                {breadcrumbs.length === 0 && (
                    <DriveSelector organizationBlock={organizationBlock} />
                )}

                <div className={styles.breadcrumbWrapper}>
                    <Breadcrumbs separator={<IconChevronRight size={18} />}>
                        {breadcrumbs.length > 0 && (
                            <div>
                                <UnstyledButton 
                                    className={selectorStyles.control} 
                                    onClick={() => { setActiveDirectory("root") }}
                                >
                                    <Group 
                                        spacing={"xs"} 
                                        noWrap
                                        style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        <IconFileShredder size={16.5} />
                                        <span className={selectorStyles.label}>
                                            <span>{organizationBlock.organization_name}</span>
                                        </span>
                                    </Group>
                                </UnstyledButton>
                            </div>
                        )}

                        {breadcrumbs.map((step) => (
                            <div>
                                <Button
                                    variant={'subtle'}
                                    color={'gray'}
                                    onClick={() => { setActiveDirectory(step.directory_id) }}
                                >
                                    {step.directory_name}
                                </Button>
                            </div>
                        ))}
                    </Breadcrumbs>
                </div>

                <div className={styles.actionMenu}>
                    <DriveActionMenu 
                        actionMenu={actionMenu}
                        selectedFolder={selectedFolder} 
                        selectedProject={selectedProject}
                        modalState={modalState}
                        setModalState={setModalState}
                    />
                </div>
            </Group>
        </div>
    )
}

export type { IToolbarBreadcrumb }
export default DriveToolbar
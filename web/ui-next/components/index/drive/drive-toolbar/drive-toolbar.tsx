import { Breadcrumbs, Button, Group, UnstyledButton } from '@mantine/core'
import { useContext, useEffect, useState } from 'react'
import { OrganizationContextData } from '../../../data/organization/context'
import { IDriveResp, IOrganization, IOrganizationController } from '../../../data/organization/types'
import DriveSelector from '../drive-selector/drive-selector'
import styles from './drive-toolbar.module.scss'
import selectorStyles from '../drive-selector/drive-selector.module.scss'
import { GetWorkingPaths } from './functions'
import { IconChevronRight, IconFileShredder } from '@tabler/icons'

interface IToolbarBreadcrumb {
    directory_name: string,
    directory_id: string
}

interface IDriveToolbarProps {
    driveData: IDriveResp | null
}

const DriveToolbar: React.FC<IDriveToolbarProps> = ({ driveData }) => {
    const { 
        activeDirectory, 
        setActiveDirectory,
        organizations,
        selectedOrganization, 
    } = useContext(OrganizationContextData) as IOrganizationController

    const [breadcrumbs, setBreadcrumbs] = useState<IToolbarBreadcrumb[]>([])
    const [organizationBlock, setOrganizationBlock] = useState<IOrganization>({} as IOrganization)

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
                        
                </div>
            </Group>
        </div>
    )
}

export type { IToolbarBreadcrumb }
export default DriveToolbar
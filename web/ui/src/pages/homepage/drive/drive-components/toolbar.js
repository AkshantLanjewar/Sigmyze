import React, { useState, useEffect } from 'react'

import { 
    Box, 
    Breadcrumbs, 
    Button,
    Group,
    Center,
    SegmentedControl
} from '@mantine/core'

import { connect }         from 'react-redux'
import { 
    ChangeDirectory,
    ToggleDriveUpdate
} from '../../../../data/actions/driveActions'
import { 
    SetOrganization,
    SetOrganizations 
} from "../../../../data/actions/organizationActions"

import DriveSelector       from './drive-selector'
import { GetOrganization } from '../../../../components/lib'

import { TiCloudStorage }  from 'react-icons/ti'
import { AiFillDashboard } from 'react-icons/ai'

const NavBox = ({ name, id, SetWorkingDirectory }) => {
    return (
        <Button
            variant={'subtle'}
            color={'cyan'}
            onClick={() => { SetWorkingDirectory(id) }}
        >
            {name}
        </Button>
    )
}

const DriveToolbar = 
({ user, drive, organization, paths, ToggleDriveUpdate, SetOrganizations, SetWorkingDirectory, SetOrganization, view, setView }) => {
    const breadcrumbRef = React.useCallback((node) => {
        if(node !== null && node.clientWidth > 0 && !breadcrumbLoaded) {
            setBreadcrumbWidth(node.clientWidth - 200)
            setBreadcrumbLoaded(true)
        }
    })
    
    const [breadcrumbWidth, setBreadcrumbWidth]   = useState(0)
    const [breadcrumbLoaded, setBreadcrumbLoaded] = useState(false)
    const [breadcrumbItems, setBreadcrumbItems]   = useState([])

    const [segmentData, setSegmentData] = useState([])

    useEffect(() => {
        if(!breadcrumbLoaded)
            return
        
        setBreadcrumbItems([...paths])
    }, [breadcrumbLoaded])

    useEffect(() => {
        if(paths.length !== breadcrumbItems.length)
            setBreadcrumbItems([...paths])
    }, [paths])

    useEffect(() => {
        let segments = []

        let driveTab = {
            value: 'drive',
            label: (
                <Center>
                    <TiCloudStorage size={16} />
                    <Box ml={10}>Disk</Box>
                </Center>
            )
        }
        segments.push(driveTab)

        let organization_id  = organization.organization_id
        let organization_    = GetOrganization(organization_id, organization.total_organizations)
        if(organization_ !== null && organization_.has_page) {
            let publishedTab = {
                value: 'published',
                label: (
                    <Center>
                        <AiFillDashboard size={16} />
                        <Box ml={10}>Admin</Box>
                    </Center>
                )
            }

            segments.push(publishedTab)
        }

        setSegmentData([...segments])
    }, [organization])

    return (
        <Box
            p={"md"}
            pb={"xs"}
            mb={"xl"}
            sx={(theme) => ({
                borderBottom: `1px solid ${theme.colors.dark[3]}`
            })}
        >
            <Group position={'apart'} noWrap>
                <Group sx={{ flexGrow: 1 }}>
                    <DriveSelector
                        user={user}
                        drive={drive}
                        setSegmentData={setSegmentData}
                        setView={setView}
                        ToggleDriveUpdate={ToggleDriveUpdate}
                        SetOrganizations={SetOrganizations}
                        SetOrganizationRedux={SetOrganization}
                        SetWorkingDirectory={SetWorkingDirectory}
                    />
                    
                    <div 
                        style={{ 
                            flexGrow: 1, 
                            maxWidth: breadcrumbWidth == 0 ? 'auto' : breadcrumbWidth,
                            overflowX: 'auto'
                        }} 
                        ref={breadcrumbRef}
                    >
                        <div style={{ display: 'inline-block' }}>
                            <Breadcrumbs sx={{ flexDirection: 'row-reverse' }}>    
                                {breadcrumbItems.reverse().map((step => ( 
                                    <NavBox 
                                        name={step.name} 
                                        id={step.id}
                                        SetWorkingDirectory={SetWorkingDirectory}
                                    /> 
                                )))}
                            </Breadcrumbs>
                        </div>
                    </div>
                </Group>

                <Box>
                    {segmentData.length > 0 && (
                        <SegmentedControl 
                            color={"cyan"} 
                            data={segmentData} 
                            value={view}
                            onChange={setView}
                        />
                    )}
                </Box>
            </Group>
        </Box>
    )
}

const mapStateToProps = state => ({
    user: state.user,
    drive: state.drive,
    organization: state.organization
})

const mapDispatchToProps = dispatch => ({
    ToggleDriveUpdate: () => { dispatch(ToggleDriveUpdate()) },
    SetOrganizations: (organizations) => { dispatch(SetOrganizations(organizations)) },
    SetWorkingDirectory: (folder_id) => { dispatch(ChangeDirectory(folder_id)) },
    SetOrganization: (user_organization, organization_id, organization_admin) => {
        dispatch(SetOrganization(user_organization, organization_id, organization_admin))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(DriveToolbar)
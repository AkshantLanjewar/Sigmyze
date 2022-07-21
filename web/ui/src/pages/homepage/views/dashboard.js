import React from 'react'

import { 
    Grid,
    Container,
    Text,
    Title,
    Group,
    Button,
    Tabs,
    SimpleGrid 
} from '@mantine/core'

import { IoMdCreate }     from 'react-icons/io'
import { BsClockFill }    from 'react-icons/bs'
import { AiFillAppstore } from 'react-icons/ai'
import { FaArchive }      from 'react-icons/fa'

import ProjectPreview        from '../dashboard-components/project-preview'
import ProjectsTable         from '../dashboard-components/project-table'
import StatsCard             from '../dashboard-components/stats-card'
import DashboardNotification from '../dashboard-components/dashboard-notifications'

const Dashboard = ({ user }) => {
    return (
        <Container p={"xl"} fluid>
            <Grid gutter={0} columns={24} p={"xl"}>
                <Grid.Col span={16} pl={"xl"}>
                    <Title order={2}>Welcome Back User</Title>

                    <Group position={"left"} spacing={"md"} mt={"lg"}>
                        <ProjectPreview />
                        <ProjectPreview />
                        <ProjectPreview />
                    </Group>

                    <Group position={'apart'} pt={"xl"} mt={'xl'}>
                        <Text size={"lg"} weight={"bold"}>Manage Projects</Text>

                        <Button 
                            leftIcon={ <IoMdCreate size={14} /> } 
                            radius={'xl'} 
                            color={'gray'}
                        >
                            Create Project
                        </Button>
                    </Group>
                    
                    <Tabs color={'gray'} mt={"lg"} pl={"lg"} pr={"lg"}>
                        <Tabs.Tab 
                            label="Recently Edited Projects" 
                            icon={<BsClockFill size={14} />}
                        >
                            <ProjectsTable />
                        </Tabs.Tab>

                        <Tabs.Tab
                            label="All Projects"
                            icon={<AiFillAppstore size={14} />}
                        >
                            <ProjectsTable />
                        </Tabs.Tab>

                        <Tabs.Tab
                            label="Archived Projects"
                            icon={<FaArchive size={14} />}
                        >
                            <ProjectsTable />
                        </Tabs.Tab>
                    </Tabs>
                </Grid.Col>

                <Grid.Col span={1} />

                <Grid.Col span={7}>
                    <SimpleGrid cols={2}>
                        <StatsCard />
                        <StatsCard />
                    </SimpleGrid>

                    <Title 
                        mt={"xl"} 
                        mb={"xl"} 
                        order={3} 
                        weight={700}
                    >
                        Notifications
                    </Title>

                    <DashboardNotification />
                </Grid.Col>
            </Grid>
        </Container>
    )
}

export default Dashboard
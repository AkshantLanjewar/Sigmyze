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

                    <SimpleGrid 
                        position={"left"} 
                        spacing={"md"} 
                        mt={"lg"}
                        cols={3}
                    >
                        <ProjectPreview />
                        <ProjectPreview />
                        <ProjectPreview />
                    </SimpleGrid>

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

                    <Tabs 
                        defaultValue={"recent"}
                        color={'pink'}
                        mt={'lg'}
                        pl={'lg'}
                        pr={'lg'}
                    >
                        <Tabs.List>
                            <Tabs.Tab 
                                value={"recent"}
                                icon={<BsClockFill size={14} />}
                            >
                                Recently Edited Projects
                            </Tabs.Tab>

                            <Tabs.Tab 
                                value={"all"}
                                icon={<AiFillAppstore size={14} />}
                            >
                                All Projects
                            </Tabs.Tab>

                            <Tabs.Tab 
                                value={"archive"}
                                icon={<FaArchive size={14} />}
                            >
                                Archived Projects
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value={'recent'} pt={'xs'}>
                            <ProjectsTable />
                        </Tabs.Panel>
                        <Tabs.Panel value={'all'} pt={'xs'}>
                            <ProjectsTable />
                        </Tabs.Panel>
                        <Tabs.Panel value={'archive'} pt={'xs'}>
                            <ProjectsTable />
                        </Tabs.Panel>
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
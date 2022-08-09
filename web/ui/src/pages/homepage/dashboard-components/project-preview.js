import React, { useEffect, useState } from 'react'

import { 
    Card,
    Text,
    Group,
    Menu,
    ActionIcon 
} from '@mantine/core'

import useStyles from './project-preview.styles'

import { 
    AiFillFolderOpen,
    AiFillDelete 
} from 'react-icons/ai'
import { 
    BsFillGearFill,
    BsArchiveFill,
    BsThreeDots 
} from 'react-icons/bs'

import MiniLunarChart   from '../../../components/lunar-chart/mini-chart'
import { GetIndicator } from '../../../data/server-interface'
import ParseWEOData     from '../../../data/backend/weo-data'

const ProjectPreview = ({ }) => {
    const { classes }     = useStyles()
    const [data, setData] = useState({ names: [], datasets: [] })

    async function main() {
        let names    = []
        let datasets = []

        let dataset = 'WEO'
        let ind_id  = 'NGDP'
        let obj_id  = 'USA'

        let data           = await GetIndicator(dataset, obj_id, ind_id)
        let indicator_data = data.indicator_data
        indicator_data     = ParseWEOData(indicator_data)
        names.push(ind_id)

        for(let i = 0; i < indicator_data.length; i++) {
            let data_point = indicator_data[i]

            let app_obj     = {}
            app_obj['date'] = new Date(data_point['date'])
            app_obj[ind_id] = data_point['value']
            datasets.push(app_obj)
        }

        let sortedData = datasets.slice().sort((a, b) => a.date.getTime() - b.date.getTime())
        setData({ names: names, datasets: sortedData })
    }

    useEffect(() => {
        main()
    }, [])

    return (
        <Card radius={"sm"} className={classes.card}>
            <Card.Section className={classes.chart}>
                <MiniLunarChart
                    data={data.datasets}
                    names={data.names}
                />
            </Card.Section>

            <div className={classes.body}>
                <Text className={classes.title}>This is the title of your project</Text>

                <Group position={"apart"} mt={"lg"}>
                    <div>
                        <Text className={classes.description}>AKSHANT:PNPY</Text>
                        <Text className={classes.description}>Last edited, July 2022</Text>
                    </div>
                    
                    <Menu
                        placement={'bottom-end'}
                        withArrow
                        shadow={'md'}
                    >
                        <Menu.Target>
                            <ActionIcon
                                variant={'transparent'}
                                color={'gray'}
                                size={'sm'}
                            >
                                <BsThreeDots />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Projects</Menu.Label>

                            <Menu.Item icon={<AiFillFolderOpen size={14} />}>Open Project</Menu.Item>
                            <Menu.Item icon={<BsFillGearFill size={14} />}>Project Settings</Menu.Item>
                            <Menu.Item icon={<BsArchiveFill size={14} />}>Archive Project</Menu.Item>
                            <Menu.Item icon={<AiFillDelete size={14} />}>Delete Project</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </div>
        </Card>
    )
}

export default ProjectPreview
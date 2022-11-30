import React, { useState, useEffect } from 'react'

import {
    Box,
    Card,
    Title,
    Text
} from '@mantine/core'

import MiniLunarChart from "../../../lunar-chart/mini-chart"
import MultimediaMenu from "../multimedia-menu"

import { BsThreeDots } from "react-icons/bs"

const ChartRender = ({ block, editor, useJustify, justify, setJustify, CreateBlock, DeleteBlock, EditChart }) => {
    const [data, setData]     = useState([])
    const [names, setNames]   = useState([])
    const [opened, setOpened] = useState(false)

    let selected    = block.data.indicators
    let title       = block.data.title
    let description = block.data.description

    async function main() {
        let data_dict = {}
        let datasets  = []
        let names     = []

        for(let i = 0; i < selected.length; i++) {
            let item = selected[i]
            let data = item.data
            if(item.r_data.length > data.length)
                data = item.r_data

            for(let x = 0; x < data.length; x++) {
                let point = data[x]

                let date  = new Date(point['date'])
                let val   = point[item.names[0]]

                if(!(date in data_dict))
                    data_dict[date] = {}
                data_dict[date][item.names[0]] = val
            }

            names.push(item.names[0])
        }

        let keys = Object.keys(data_dict)
        for(let i = 0; i < keys.length; i++) {
            let slice = data_dict[keys[i]]

            for(let x = 0; x < names.length; x++) {
                let name = names[x]
                if(!(name in slice))
                    slice[name] = null
            }

            slice['date'] = new Date(keys[i])
            datasets.push(slice)
        }

        let sorted_data = datasets.slice().sort((a, b) => a.date.getTime() - b.date.getTime())
        setNames([...names])
        setData([...sorted_data])
    }

    useEffect(() => {
        main()
    }, [selected])

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                width: "100%",
                justifyContent: editor || useJustify ? justify : ""
            }}
            mb={"md"}
            mt={"md"}
        >
            <Card
                shadow={"sm"}
                p={"lg"}
                radius={"md"}
                sx={{
                    width: 500,
                    position: 'relative'
                }}
            >
                <Card.Section
                    sx={(theme) => ({
                        backgroundColor: theme.colors.dark[9],
                        height: 225,
                        position: 'relative'
                    })}
                >
                    <MiniLunarChart
                        data={data}
                        names={names}
                        useTooltip={true}
                        usePadding={true}
                        paddingAmount={10}
                    />
                </Card.Section>

                {editor && (
                    <MultimediaMenu
                        block={block}
                        opened={opened}
                        setMenuOpened={setOpened}
                        icon={<BsThreeDots size={14} />}
                        sx={{ position: 'absolute', right: 10, top: 10, zIndex: 10 }}
                        name={`${block.id}-chart-block`}
                        setJustify={setJustify}
                        CreateBlock={CreateBlock}
                        DeleteBlock={DeleteBlock}
                        EditBlock={EditChart}
                    />
                )}

                <Card.Section
                    pl={"md"}
                    pr={"md"}
                    pt={"sm"}
                    pb={"sm"}
                >
                    <Title order={3}>
                        {title}
                    </Title>
                    <Text size={"sm"} color={"dimmed"} sx={{ paddingLeft: 1 }}>
                        {description}
                    </Text>
                </Card.Section>
            </Card>
        </Box>
    )
}

export default ChartRender
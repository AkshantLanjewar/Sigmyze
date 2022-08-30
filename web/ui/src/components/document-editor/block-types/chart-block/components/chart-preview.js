import React, { useEffect, useState } from 'react'

import { 
    Card,
    Title,
    Text 
} from '@mantine/core'

import MiniLunarChart   from '../../../../lunar-chart/mini-chart'

const ChartPreview = ({ selected }) => {
    const [data, setData]   = useState([])
    const [names, setNames] = useState([])

    async function main() {
        let data_dict = {}
        let datasets  = []
        let names     = []

        for(let i = 0; i < selected.length; i++) {
            let item = selected[i]
            let data = item.data

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
        console.log(sorted_data)
        setNames([...names])
        setData([...sorted_data])
    }

    useEffect(() => {
        main()
    }, [selected])

    return (
        <Card
            shadow={"sm"}
            p={"lg"}
            radius={"md"}
            sx={{ width: "70%", margin: "0 auto" }}
        >
            <Card.Section 
                sx={(theme) => ({ 
                    backgroundColor: theme.colors.dark[9],
                    height: 200
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

            <Card.Section 
                pl={"md"} 
                pr={"md"} 
                pt={"sm"}
                pb={"sm"}
            >
                <Title order={3}>Chart Preview</Title>
                <Text size={"sm"} color={"dimmed"} sx={{ paddingLeft: 1 }}>Indicators: IND_GDP, USA_GDP</Text>
            </Card.Section>
        </Card>
    )
}

export default ChartPreview
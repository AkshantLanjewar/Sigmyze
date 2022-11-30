import React, { useEffect, useState } from 'react'

import { 
    Card,
    Title,
    Text
} from '@mantine/core'

import { BsThreeDots }              from 'react-icons/bs'

import MiniLunarChart   from '../../../../lunar-chart/mini-chart'
import MultimediaMenu   from '../../multimedia-menu'

const ChartPreview = ({ justify, setJustify, selected, title, description, useMenu, noMargin, block, DeleteBlock, CreateBlock, EditChart }) => {
    const [menuOpen, setMenuOpen] = useState(false)

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
        setNames([...names])
        setData([...sorted_data])
    }

    useEffect(() => {
        main()
    }, [selected])

    return (
        <div 
            style={{ 
                position: 'relative', 
                width: "100%", 
                display: 'flex', 
                justifyContent: justify 
            }}
        >
            <Card
                shadow={"sm"}
                p={"lg"}
                radius={"md"}
                sx={{ 
                    width: "80%", 
                    margin: noMargin ? "" : "0 auto", 
                    position: 'relative', 
                    overflow: 'visible' 
                }}
            >
                <Card.Section 
                    sx={(theme) => ({ 
                        backgroundColor: theme.colors.dark[9],
                        height: 200,
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

                {useMenu && (
                    <MultimediaMenu
                        block={block}
                        opened={menuOpen}
                        setMenuOpened={setMenuOpen}
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
                        {title == undefined
                            ? "Chart Preview"
                            : title
                        }
                    </Title>
                    <Text size={"sm"} color={"dimmed"} sx={{ paddingLeft: 1 }}>
                        {description == undefined
                            ? "Indicators: IND_GDP"
                            : description
                        }
                    </Text>
                </Card.Section>
            </Card>
        </div>
    )
}

export default ChartPreview
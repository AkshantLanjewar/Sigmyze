import React, { useEffect, useState } from "react"
import useStyles from "./toolbar.styles"

import {
    TextInput,
    Tabs,
    Paper,
    Group,
    Text,
    ScrollArea,
    Button,
    Pagination
} from '@mantine/core'

import { AiOutlineSearch } from "react-icons/ai"

import { dummyLinearData } from "../../../data/dummy-data"
import { TimeSeries }      from "sigmyze-charting"

const IndicatorCard = ({ active, index }) => {
    const { classes, cx } = useStyles()
    let tChartOptions = { id: "USD-GBP", type: "line", data: dummyLinearData, color: "#031158" }

    return (
        <Paper radius={"md"} className={cx(classes.optionCard, { [classes.activeOptionCard]: active })}>
            <Group align={"center"}>
                <div className={classes.chart}>
                    <TimeSeries
                        horizontalTooltip={false}
                        verticalTooltip={false}
                        xAxis={false}
                        charts={[tChartOptions]}
                    />
                </div>

                <div>
                    <Text
                        color="dimmed"
                        size={"xs"}
                        transform={"uppercase"}
                        weight={700}
                    >
                        NGDP
                    </Text>

                    <Text
                        weight={700}
                        size={"md"}
                    >
                        National GDP
                    </Text>
                </div>
            </Group>
        </Paper>
    )
}

const AddIndicator = ({ }) => {
    const { classes }  = useStyles()
    let indicators     = [{ active: false, index: 0 }, { active: false, index: 1 }]

    const containerRef = React.createRef()

    const [dataIndicators, setDataIndicators]       = useState(indicators)
    const [displayIndicators, setDisplayIndicators] = useState([[]])
    const [activePage, setActivePage]               = useState(1)
    const [containerHeight, setContainerHeight]     = useState(0)

    useEffect(() => {
        let height = containerRef.current.getBoundingClientRect().height
        height = height - 36

        let maxContainers = Math.round(height / 64) - 1
        let nHeight       = maxContainers * 64
        
        let di    = []
        let td    = []

        let i     = 0
        while(i < dataIndicators.length) {
            td.push(dataIndicators[i])
            if(td.length == maxContainers) {
                di.push(td)
                td = []
            }

            i++
        }

        if(td.length > 0)
            di.push(td)
        setDisplayIndicators([...di])
        setContainerHeight(nHeight)
    }, [])

    return (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: "100%" }}>
            <TextInput
                radius={"sm"}
                size={"md"}
                placeholder={"Search Indicators ..."}
                icon={ <AiOutlineSearch size={18} /> }
                className={classes.indicatorInput}
            />
            <Tabs
                position={"center"}
                variant={"pills"}
                mt={"xl"}
                styles={{
                    root: { flexGrow: 1, display: 'flex', flexDirection: 'column', height: "100%" },
                    body: { flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: "space-between", paddingBottom: "10px" }
                }}
            >
                <Tabs.Tab label="All" mb={"lg"}>
                    <div style={{ height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} ref={containerRef}>
                        <div>
                            <div style={{ height: `${containerHeight}px` }}>
                                {displayIndicators[activePage - 1].map(step => (
                                    <IndicatorCard active={step.active} index={step.index}  />
                                ))}
                            </div>

                            {displayIndicators.length > 1
                                ? <Pagination 
                                    position={"center"} 
                                    total={displayIndicators.length} 
                                    radius={"sm"} mt={"lg"} 
                                    page={activePage} 
                                    onChange={setActivePage} 
                                />

                                : null
                            }
                        </div>
                        
                        <Button disabled>Add</Button>
                    </div>
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}

export default AddIndicator
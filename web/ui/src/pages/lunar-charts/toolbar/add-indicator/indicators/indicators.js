import React, { useState, useEffect } from "react"

import {
    Container,
    Stack,
    Title,
    Text,
    Autocomplete,
    Tabs,
    Loader,
    Group
} from "@mantine/core"

import useStyles from '../../../../indicators/indicators.styles'

import AutoComplete from "./country-autocomplete"
import IndicatorView from "./indicator-view"

import { 
    GetObjects,
    GetCategories 
} from "../../../../../data/server-interface"

import ICON_DICT from '../../../../../assets/category-icons'
import { MdAllInclusive } from 'react-icons/md'

async function FetchCountries(dataset) {
    let objects = await GetObjects(dataset)
    objects     = objects['objects']
    let full_o  = []


    for(let i = 0; i < objects.length; i++) {
        let obj = objects[i]

        obj['obj']    = obj['object_id']
        obj['logo']   = obj['object_logo']
        obj['name']   = obj['object_fullname']
        obj['active'] = false
        obj['value']  = obj['name']
        obj['image']  = obj['object_logo']

        full_o.push(obj)
    }

    return full_o
}

async function FetchCategories(dataset) {
    let categories = await GetCategories(dataset)
    categories     = categories['categories']
    let cats       = []
    cats.push({ category: "All", icon: <MdAllInclusive /> })

    for(let i = 0; i < categories.length; i++) {
        let category = categories[i]
        cats.push({
            category: category,
            icon: ICON_DICT[category]
        })
    }

    return cats
}

const Indicators = ({ dataset, setIndicator }) => {
    const { classes } = useStyles()
    const [countries, setCountries] = useState([])
    const [categories, setCategories] = useState([])
    const [activeCountry, setActiveCountry] = useState({ object_id: 'USA', object_fullname: "United States" })

    const [tabValue, setTabValue] = useState([])

    async function main() {
        let country = await FetchCountries(dataset)
        setCountries([...country])

        let cats = await FetchCategories(dataset)
        setCategories([...cats])
        setTabValue(cats[0].category)
    }

    useEffect(() => {
        main()
    }, [])

    return (
        <div>
            <Container>
                <Stack pt={"sm"} align={"center"} pb={"xl"}>
                    <Title>World Economic Outlook</Title>
                </Stack>
            </Container>

            <Stack
                align={"center"}
                spacing={"xs"}
                mb="xl"
            >
                <Autocomplete
                    label="Selected Country"
                    placeholder="Select Country"
                    itemComponent={AutoComplete}
                    data={countries}
                    limit={10}
                    defaultValue={"United States"}
                    onItemSubmit={(item) => { setActiveCountry(item) }}
                    width={300}
                    sx={{ width: 300 }}
                />

                {categories.length == 0
                    ? <Group mt={"xl"} pt={"xl"} position={"center"}><Loader variant="bars" color="indigo" /></Group>
                    : (
                        <Tabs 
                            variant={'pills'}
                            position={'center'}
                            mt={'lg'}
                            value={tabValue}
                            onTabChange={setTabValue}
                        >
                            <Tabs.List sx={{ justifyContent: 'center' }}>
                                {categories.map((step) => (
                                    <Tabs.Tab
                                        value={step.category}
                                        icon={step.icon}
                                        key={`modal-category-${step.category}`}
                                    >
                                        {step.category}
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>

                            {categories.map((step) => (
                                <Tabs.Panel
                                    value={step.category}
                                    pt={'xs'}
                                >
                                    <IndicatorView
                                        dataset={dataset}
                                        category={step.category}
                                        country={activeCountry}
                                        setIndicator={setIndicator}
                                    />
                                </Tabs.Panel>
                            ))}
                        </Tabs> 
                    )
                }
            </Stack>
        </div>
    )
}



export default Indicators
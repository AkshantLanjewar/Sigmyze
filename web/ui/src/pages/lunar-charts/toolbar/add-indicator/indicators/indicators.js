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
    GetCountries,
    GetCategories 
} from "../../../../../data/backend/datasets"
import * as getCountryISO2 from 'country-iso-3-to-2'

import ICON_DICT from '../../../../../assets/category-icons'
import { MdAllInclusive } from 'react-icons/md'

async function FetchCountries(dataset) {
    let countries = await GetCountries(dataset)
    countries     = countries['countries']
    let full_c    = []


    for(let i = 0; i < countries.length; i++) {
        let country       = countries[i]
        country['iso2']   = getCountryISO2(country.iso3)
        country['image']  = process.env.PUBLIC_URL + `/country/${country['iso2']}.svg`
        country['active'] = false
        country['value']  = country['name']

        full_c.push(country)
    }

    return full_c
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
    const [activeCountry, setActiveCountry] = useState({ iso3: 'USA', name: "United States" })

    async function main() {
        let country = await FetchCountries(dataset)
        setCountries([...country])

        let cats = await FetchCategories(dataset)
        setCategories([...cats])
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
                />

                {categories.length == 0
                    ? <Group mt={"xl"} pt={"xl"} position={"center"}><Loader variant="bars" color="indigo" /></Group>
                    : (
                        <Tabs variant={"pills"} position={"center"} mt={"lg"}>
                            {categories.map((step) => (
                                <Tabs.Tab label={step.category} icon={step.icon} key={`modal-category-${step.category}`}>
                                    <IndicatorView
                                        dataset={dataset}
                                        category={step.category}
                                        country={activeCountry}
                                        setIndicator={setIndicator}
                                    />
                                </Tabs.Tab>
                            ))}
                        </Tabs>
                    )
                }
            </Stack>
        </div>
    )
}



export default Indicators
import React, { useState, useEffect } from "react"

import {
    Container,
    Stack,
    Title,
    Text,
    Tabs,
    SimpleGrid,
    Loader,
    Group
} from "@mantine/core"

//swiper
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper"
import "swiper/css"
import "swiper/css/pagination"

import ChartCard     from "../../components/app/chart-card/chart-card"
import CountrySearch from "../../components/country-search/country-search"

import { MdAllInclusive, MdAreaChart } from 'react-icons/md'
import ICON_DICT from "../../assets/category-icons"

import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { 
    GetObjects,
    GetIndicators,
    GetIndicator,
    GetCategories
} from '../../data/server-interface'

import  ParseWEOData from '../../data/backend/weo-data'
import * as getCountryISO2 from 'country-iso-3-to-2'

function RandomElement(list) {
    let index = Math.floor(list.length * Math.random() | 0)
    return list[index]
}

async function SelectRandomIndicator(dataset) {
    let countries = await GetObjects(dataset)
    countries     = countries['countries']
    let country   = RandomElement(countries)

    let indicators = await GetIndicators(dataset, country['iso3'])
    indicators     = indicators['indicators']
    let indicator  = RandomElement(indicators)
    if(indicators.length == 0)
        return SelectRandomIndicator(dataset)

    let data = await GetIndicator(dataset, country['iso3'], indicator['ind3'])

    return {
        data: ParseWEOData(data['data']),
        indicator: indicator,
        country: country
    }
}

async function SelectIndicatorsCategory(dataset, country, category) {
    dataset  = dataset.toUpperCase()
    category = dataset + category

    let indicators = await GetIndicators(dataset, country['iso3'])
    if(indicators['error'] == true)
        return
    indicators     = indicators['indicators']
    
    let cards = []
    for(let i = 0; i < indicators.length; i++) {
        let indicator   = indicators[i]
        let indicator_c = indicator.category

        if(indicator_c == category || category.includes("All")) {
            let data = await GetIndicator(dataset, country['iso3'], indicator.ind3)
            let pack = {
                data: ParseWEOData(data['data']),
                indicator: indicator,
                country: country
            }

            cards.push(pack)
        }
    }

    return cards
}

async function FetchCountries(dataset) {
    let countries = await GetObjects(dataset)
    countries     = countries['countries']
    let full_c    = []


    for(let i = 0; i < countries.length; i++) {
        let country       = countries[i]
        country['iso2']   = getCountryISO2(country.iso3)
        country['logo']   = process.env.PUBLIC_URL + `/country/${country['iso2']}.svg`
        country['active'] = false
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

const CategoryIndicators = ({ category = "All", dataset, iso3 }) => {
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(false)
    async function main() {
        setLoading(true)
        let c = await SelectIndicatorsCategory(dataset, iso3, category)
        setCards([...c])
        setLoading(false)
    }

    useEffect(() => {
        main()        
    }, [iso3])

    return (
        <div>
            { loading
                ? <Group mt={"xl"} pt={"xl"} position={"center"}><Loader variant="bars" color="indigo" /></Group>
                : (
                    <SimpleGrid cols={4} mt={"lg"} mb={"xl"}>
                        {cards.map((step) => (
                            <ChartCard 
                                key={uuidv4()}
                                title={`${step.country.name} ${step.indicator.fullname}`}
                                description={`${step.country.iso3}: ${step.indicator.ind3}`}
                                data={step.data}
                                verticalTooltip={true}
                                height={"300px"}
                            />
                        ))}
                    </SimpleGrid>
                )
            }
        </div>
    )
}

const Dataset = ({ }) => {
    let { dataset } = useParams()

    const [sampleIndicators, setSampleIndicators] = useState([])
    const [countries, setCountries]               = useState([])
    const [activeCountry, setActiveCountry]       = useState({ iso3: "USA", name: "United States" })
    const [categories, setCategories]             = useState([])

    async function main() {
        let sample_indicators = []
        for(let i = 0; i < 9; i++)
            sample_indicators.push(await SelectRandomIndicator(dataset))
        let countries  = await FetchCountries(dataset)
        let categories = await FetchCategories(dataset)
        
        setCountries([...countries])
        setSampleIndicators([...sample_indicators])
        setCategories([...categories])
    }

    useEffect(() => {
        main()
    }, [])

    return (
        <div>
            <Container mt={"xl"} pt={"xl"}>
                <Stack pt="xl" align={"center"} pb={"xl"}>
                    <Title>World Economic Outlook</Title>
                    <Text size={"lg"}>Explore Indicators in this dataset</Text>
                </Stack>

                <Swiper
                    style={{ marginTop: "2em" }}
                    slidesPerView={3}
                    spaceBetween={30}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                >
                    {sampleIndicators.map((step) => (
                        <SwiperSlide>
                            <ChartCard 
                                key={uuidv4()}
                                title={`${step.country.name} ${step.indicator.fullname}`}
                                description={`${step.country.iso3}: ${step.indicator.ind3}`}
                                data={step.data}
                                verticalTooltip={false}
                                height={"300px"}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <Title mt={"lg"} order={5} align={"center"}>Sample of Indicators from this set</Title>
            </Container>

            <Container size={"xl"}>
                <Stack
                    align={"center"}
                    spacing={"xs"}
                    mt="xl"
                    pt="xl"
                    mb="lg"
                >
                    <CountrySearch 
                        countries={countries}
                        setActiveC={setActiveCountry}
                    />

                    {categories.length == 0
                        ? <Group mt={"xl"} pt={"xl"} position={"center"}><Loader variant="bars" color="indigo" /></Group>
                        : (
                            <Tabs mt={"sm"} variant={"pills"} position="center">
                                {categories.map((step) => (
                                    <Tabs.Tab label={step.category} icon={step.icon}>
                                        <CategoryIndicators dataset={dataset} iso3={activeCountry} category={step.category} />
                                    </Tabs.Tab>
                                ))}
                            </Tabs>       
                        )
                    }
                </Stack>
            </Container>
        </div>
    )
}

export default Dataset
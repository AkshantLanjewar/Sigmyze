import React, { useState, useEffect } from "react"

import {
    Container,
    Stack,
    Title,
    Text,
    Tabs,
    SimpleGrid
} from "@mantine/core"

//swiper
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper"
import "swiper/css"
import "swiper/css/pagination"

import ChartCard     from "../../components/app/chart-card/chart-card"
import CountrySearch from "./country-search/country-search"

import { MdAllInclusive, MdAreaChart } from 'react-icons/md'

import { useParams } from 'react-router-dom'

import { 
    GetCountries,
    GetIndicators,
    GetIndicator
} from '../../data/backend/datasets'

import  ParseWEOData from '../../data/backend/weo-data'

function RandomElement(list) {
    let index = Math.floor(list.length * Math.random() | 0)
    return list[index]
}

async function SelectRandomIndicator(dataset) {
    let countries = await GetCountries(dataset)
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

const CategoryIndicators = ({ category = "All", dataset, iso3 }) => {
    const [cards, setCards] = useState([])
    async function main() {
        let c = await SelectIndicatorsCategory(dataset, iso3, category)
        setCards([...c])
    }

    useEffect(() => {
        main()        
    }, [])

    return (
        <SimpleGrid cols={4} mt={"lg"} mb={"xl"}>
            {cards.map((step) => (
                <ChartCard 
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

const Dataset = ({ }) => {
    let { dataset } = useParams()
    const [sampleIndicators, setSampleIndicators] = useState([])

    async function main() {
        let sample_indicators = []
        for(let i = 0; i < 9; i++)
            sample_indicators.push(await SelectRandomIndicator(dataset))

        setSampleIndicators([...sample_indicators])
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
                    <CountrySearch />
                    <Tabs mt={"sm"} variant={"pills"} position="center">
                        <Tabs.Tab label="All" icon={<MdAllInclusive size={14} />}>
                            <CategoryIndicators dataset={dataset} iso3={{ iso3: "USA", name: "United States" }} />
                        </Tabs.Tab>

                        <Tabs.Tab label="GDP" icon={<MdAreaChart size={14} />}>
                            <SimpleGrid cols={4} mt={"lg"} mb={"xl"} >
                                <ChartCard />
                                <ChartCard />
                                <ChartCard />
                                <ChartCard />
                                <ChartCard />
                                <ChartCard />
                            </SimpleGrid>
                        </Tabs.Tab>
                    </Tabs>
                </Stack>
            </Container>
        </div>
    )
}

export default Dataset
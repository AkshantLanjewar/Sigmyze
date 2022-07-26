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
    let objects = await GetObjects(dataset)
    objects     = objects['objects']
    let obj     = RandomElement(objects)

    let indicators = await GetIndicators(dataset, obj['object_id']) 
    indicators     = indicators['indicators']
    let indicator  = RandomElement(indicators)
    if(indicators.length == 0)
        return SelectRandomIndicator(dataset)

    let data = await GetIndicator(dataset, obj['object_id'], indicator['indicator_id'])
    data = ParseWEOData(data['indicator_data'])
    if(data.length == 0)
        return SelectRandomIndicator(dataset)

    return {
        data: data,
        indicator: indicator,
        object: obj
    }
}

async function SelectIndicatorsCategory(dataset, object, category) {
    dataset  = dataset.toUpperCase()
    category = category

    let indicators = await GetIndicators(dataset, object['object_id'])
    if(indicators['error'] == true)
        return
    indicators     = indicators['indicators']
    
    let cards = []
    for(let i = 0; i < indicators.length; i++) {
        let indicator   = indicators[i]
        let indicator_c = indicator.category

        if(indicator_c == category || category == "All") {
            let data = await GetIndicator(dataset, object['object_id'], indicator['indicator_id'])
            data = ParseWEOData(data['indicator_data'])
            if(data.length == 0)
                continue

            let pack = {
                data: data,
                indicator: indicator,
                object: object
            }

            cards.push(pack)
        }
    }

    return cards
}

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

const CategoryIndicators = ({ category = "All", dataset, object }) => {
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(false)
    async function main() {
        setLoading(true)

        let c = await SelectIndicatorsCategory(dataset, object, category)
        setCards([...c])

        setLoading(false)
    }

    useEffect(() => {
        main()        
    }, [object])

    return (
        <div>
            { loading
                ? <Group mt={"xl"} pt={"xl"} position={"center"}><Loader variant="bars" color="indigo" /></Group>
                : (
                    <SimpleGrid cols={4} mt={"lg"} mb={"xl"}>
                        {cards.map((step) => (
                            <ChartCard 
                                key={uuidv4()}
                                title={`${step.object.object_fullname} ${step.indicator.indicator_fullname}`}
                                description={`${step.object.object_id}: ${step.indicator.indicator_id}`}
                                data={step.data}
                                verticalTooltip={true}
                                height={"320px"}
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
    const [activeObject, setActiveObject]         = useState({object_id: "USA", object_fullname: "United States"})
    const [categories, setCategories]             = useState([])
    const [tabValue, setTabValue]                 = useState(null)

    async function main() {
        let sample_indicators = []
        for(let i = 0; i < 9; i++)
            sample_indicators.push(await SelectRandomIndicator(dataset))

        let countries  = await FetchCountries(dataset)
        let categories = await FetchCategories(dataset)        
        setCountries([...countries])
        setSampleIndicators([...sample_indicators])
        setCategories([...categories])
        setTabValue(categories[0].category)
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
                                title={`${step.object.object_fullname} ${step.indicator.indicator_fullname}`}
                                description={`${step.object.object_id}: ${step.indicator.indicator_id}`}
                                data={step.data}
                                verticalTooltip={false}
                                height={"320px"}
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
                        dataset={dataset} 
                        objects={countries}
                        defaultObject={activeObject}
                        setActiveC={setActiveObject}
                    />

                    {categories.length == 0
                        ? <Group mt={"xl"} pt={"xl"} position={"center"}><Loader variant="bars" color="indigo" /></Group>
                        : (
                            <Tabs
                                variant={'pills'}
                                mt={'sm'}
                                value={tabValue}
                                onTabChange={setTabValue}
                            >
                                <Tabs.List sx={{ justifyContent: 'center' }}>
                                    {categories.map((step) => (
                                        <Tabs.Tab value={step.category} icon={step.icon}>
                                            {step.category}
                                        </Tabs.Tab>
                                    ))}
                                </Tabs.List>

                                {categories.map((step) => (
                                    <Tabs.Panel 
                                        value={step.category} 
                                        pt={'xs'}
                                    >
                                        <CategoryIndicators 
                                            dataset={dataset} 
                                            object={activeObject} 
                                            category={step.category} 
                                        />
                                    </Tabs.Panel>
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
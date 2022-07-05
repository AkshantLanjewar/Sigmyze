import React, { useEffect, useState } from "react"

import {
    Group,
    Loader,
    Pagination,
    SimpleGrid,
    Autocomplete
} from "@mantine/core"

import { GetIndicator, GetIndicators } from "../../../../../data/backend/datasets"
import { v4 as uuidv4 } from 'uuid'
import ChartCard from "../../../../../components/app/chart-card/chart-card"
import ParseWEOData from "../../../../../data/backend/weo-data"

const IndicatorView = ({ dataset, category, country, setIndicator }) => {
    const [indicators, setIndicators]     = useState([])
    const [indicators_d, setIndicators_d] = useState([])
    const [page, setPage]                 = useState(1)
    const [pages, setPages]               = useState([[]])
    const [value, setValue]               = useState("")

    function GeneragePages(cards) {
        let card_length = cards.length
        let card_pages  = []
        for(let i = 0; i < card_length; i += 3) {
            let tmp_page = []
            
            if(cards[i] !== undefined)
                tmp_page.push(cards[i])
            if(cards[i+1] !== undefined)
                tmp_page.push(cards[i+1])
            if(cards[i+2] !== undefined)
                tmp_page.push(cards[i+2])

            card_pages.push(tmp_page)
        }

        return card_pages
    }

    function SetActiveCard(ind3) {
        let cards = indicators_d

        for(let i = 0; i < cards.length; i++) {
            let card = cards[i]
            card['active'] = false

            if(card.indicator.ind3 == ind3)
                card['active'] = true
            cards[i] = card
        }

        setIndicator({ ind3: ind3, iso3: country.iso3, dataset: dataset })
        setIndicators_d([...cards])
        setIndicators([...cards])
    }

    async function main() {
        setIndicators([])
        setIndicators_d([])

        let dataset_    = dataset.toUpperCase()
        let category_   = dataset_ + category
        let indicators_ = await GetIndicators(dataset_, country['iso3'])
        
        if(indicators_['error'] == true)
            return
        indicators_ = indicators_['indicators']

        let cards = []
        for(let i = 0; i < indicators_.length; i++) {
            let indicator   = indicators_[i]
            let indicator_c = indicator.category

            if(indicator_c == category_ || category_.includes("All")) {
                let data = await GetIndicator(dataset_, country['iso3'], indicator.ind3)
                let pack = {
                    data: ParseWEOData(data['data']),
                    indicator: indicator,
                    country: country,
                    value: indicator.fullname,
                    active: false
                }

                cards.push(pack)
            }
        }

        //create pages
        let card_pages  = GeneragePages(cards)
        setPages([...card_pages])
        setIndicators([...cards])
        setIndicators_d([...cards])
    }

    useEffect(() => {
        main()
    }, [country])

    useEffect(() => {
        let cards = indicators
        let match = []

        for(let i = 0; i < cards.length; i++) {
            let card = cards[i]
            if(card.value.includes(value))
                match.push(card)
        }


        setPage(1)
        let card_pages  = GeneragePages(match)
        setPages([...card_pages])
    }, [value])

    return (
        <div>
            {indicators.length == 0
                ? <Group mt={"xl"} pt={"xl"} position={"center"}><Loader variant="bars" color="indigo" /></Group>
                : (
                    <div>
                        <Group
                            align={"center"}
                            position={"center"}
                            mb={"md"}
                            mt={"md"}
                        >
                            <Autocomplete
                                placeholder="Search Indicators"
                                data={indicators}
                                sx={{ maxWidth: 300 }}
                                value={value}
                                onChange={setValue}
                            />
                        </Group>

                        <SimpleGrid
                            cols={3}
                            mt={"sm"}
                            mb={"xl"}
                        >
                            {pages[page - 1 == undefined ? 0 : page - 1].map((step) => (
                                <div onClick={() => { SetActiveCard(step.indicator.ind3) }}>
                                    <ChartCard
                                        key={uuidv4()}
                                        title={`${step.country.name} ${step.indicator.fullname}`}
                                        description={`${step.country.iso3}: ${step.indicator.ind3}`}
                                        data={step.data}
                                        verticalTooltip={true}
                                        height={"300px"}
                                        active={step.active}
                                    />
                                </div>
                            ))}
                        </SimpleGrid>

                        <Pagination
                            total={pages.length}
                            page={page}
                            onChange={setPage}
                            color={"gray"}
                            size={"md"}
                            radius={"sm"}
                            position={"center"}
                        />
                    </div>
                )
            }
        </div>
    )
}

export default IndicatorView
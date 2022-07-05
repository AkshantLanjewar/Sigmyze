import React, { useEffect, useState } from "react"

import {
    Group,
    Loader,
    Pagination,
    SimpleGrid,
    Autocomplete
} from "@mantine/core"

import { GetIndicator, GetIndicators } from "../../../../../data/server-interface"
import { v4 as uuidv4 } from 'uuid'
import ChartCard from "../../../../../components/app/chart-card/chart-card"
import ParseWEOData from "../../../../../data/backend/weo-data"

/*
    [COMPONENT] -> IndicatorView
    
    [param] dataset: the dataset that has been selected in the dataset view
    [param] category: the active category that has been selected, eg. All, GDP
    [param] country: the active object (country is old term) selected through the dropdown
    [param] setIndicator: the function to set the active indicator in the parent component
*/

const IndicatorView = ({ dataset, category, country, setIndicator }) => {
    /*
        STATE USED IN COMPONENT

        indicators: this is the displayed indicator cards (used for search functionality)
        indicators_d: this is the full indicator data set, used to create alterations for indicators (used for search functionality)
        page: this is the active page used in the mantine pagination
        pages: this is the data structure that stores all the cards as a 2d array so it can page through lists of 3 cards
        value: this is the active search value, used in the searchbar for the indicators
    */
    const [indicators, setIndicators]     = useState([])
    const [indicators_d, setIndicators_d] = useState([])
    const [page, setPage]                 = useState(1)
    const [pages, setPages]               = useState([[]])
    const [value, setValue]               = useState("")

    /*
        FUNCTION USED TO GENERATE 2D ARRAY OF CARDS
        [param] cards: this is a 1D array of card data passed to the function
        
        [return] card_pages: this is the 2D array, in which the cards get converted from a 1D
        array of n_length to an array with sub arrays of a max length of 3
    */
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

    /*
        FUNCTION THAT SETS THE SELECTED CARD
        [description] -> Updates the state so the user can visually identify the indicator that they have selected
        [param] indicator_id: The server given indicator id used to find the indicator

        [state] setIndicator: sets the active indicator selected (passed to redux state)
            [state_param] indicator_id: the id of the active indicator
            [state_param] object_id: the object id used from the dataset
            [state_param] dataset: the dataset being used
            [state_action] -> this state update ends up being passed to redux, indicator_id, object_id, and dataset are the params passed to GetIndicator
    */
    function SetActiveCard(indicator_id) {
        let cards = indicators_d
        for(let i = 0; i < cards.length; i++) {
            let card = cards[i]
            card['active'] = false

            if(card.indicator.indicator_id == indicator_id)
                card['active'] = true
            cards[i] = card
        }

        setIndicator({ indicator_id: indicator_id, object_id: country.object_id, object_fullname: country.object_fullname, dataset: dataset })
        setIndicators_d([...cards])
        setIndicators([...cards])
    }

    /*
        MAIN FUNCTION IN COMPONENT
        [description] -> Grabs all relevant data for the indicator view, including list of indicators, and each indicators associated data

        [fetch] GetIndicators -> indicators_: this grabs all the indicators in the dataset, passing it to create cards
        [fetch] GetIndicator -> indicator_data: this is the fine details of each indicator, including
            1. Chart Data
            2. Indicator name (indicator_id + indicator_name)
            3. Object name (object_id + object_fullname)
            4. Active or not

        [state] setIndicators: sets the cards that will be displayed
        [state] setPages: sets up the display, so cards are displayed using mantines pagination
    */
    async function main() {
        setIndicators([])
        setIndicators_d([])

        let indicators_  = await GetIndicators(dataset, country.object_id)
        if(indicators_['error'] == true)
            return
        indicators_ = indicators_['indicators']

        let cards = []
        for(let i = 0; i < indicators_.length; i++) {
            let indicator          = indicators_[i]
            let indicator_category = indicator.category

            if(indicator_category == category || category == "All") {
                let indicator_data = await GetIndicator(dataset, country.object_id, indicator.indicator_id)
                indicator_data     = ParseWEOData(indicator_data['indicator_data'])
                if(indicator_data.length == 0)
                    continue

                let card = {
                    data: indicator_data,
                    indicator: indicator,
                    object: country,
                    value: indicator.indicator_fullname,
                    active: false
                }

                cards.push(card)
            }
        }

        let card_pages = GeneragePages(cards)
        
        setPages([...card_pages])
        setIndicators([...cards])
        setIndicators_d([...cards])
    }

    useEffect(() => {
        main()
    }, [country])

    /*
        ON SEARCH VALUE STATE CHANGE
        [description] -> Filters out cards based on their fullname based on the current search value

        [state] setPage: sets the pagination to page 1, so there is no index out of bounds
        [state] setPages: sets the display pages to those that match the filter criteria
    */
    useEffect(() => {
        let cards = indicators_d

        let match = []

        for(let i = 0; i < cards.length; i++) {
            let card = cards[i]
            if(card.value.includes(value))
                match.push(card)
        }

        let card_pages = GeneragePages(match)
        if(card_pages.length == 0)
            card_pages.push([])

        setPage(1)
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
                            {pages[page - 1 == undefined ? 0 : page - 1].map((step) => {
                                return (
                                    <div onClick={() => { SetActiveCard(step.indicator.indicator_id) }}>
                                        <ChartCard
                                            key={uuidv4()}
                                            title={`${step.object.object_fullname} ${step.indicator.indicator_fullname}`}
                                            description={`${step.object.object_id}: ${step.indicator.indicator_id}`}
                                            data={step.data}
                                            verticalTooltip={true}
                                            height={"300px"}
                                            active={step.active}
                                        />
                                    </div>
                                )
                            })}
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
import React from "react"

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

import useStyles from "./dataset.styles"

import ChartCard     from "../../components/app/chart-card/chart-card"
import CountrySearch from "./country-search/country-search"

import { MdAllInclusive, MdAreaChart } from 'react-icons/md'

const Dataset = ({ }) => {
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
                    <SwiperSlide>
                        <ChartCard verticalTooltip={false} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <ChartCard verticalTooltip={false} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <ChartCard verticalTooltip={false} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <ChartCard verticalTooltip={false} />
                    </SwiperSlide>
                </Swiper>

                <Title mt={"lg"} order={5} align={"center"}>Popular Indicators from this set</Title>
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
                            <SimpleGrid cols={4} mt={"lg"} mb={"xl"}>
                                <ChartCard />
                                <ChartCard />
                                <ChartCard />
                                <ChartCard />
                                <ChartCard />
                                <ChartCard />
                            </SimpleGrid>
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
import React, { useEffect, useState } from "react"
import './homepage.scoped.scss'

import { 
    Button,
    Container,
    Group,
    SimpleGrid
} from "@mantine/core"

import ChartCard from "../../components/app/chart-card/chart-card"
import FeatureCard from "./sub-components/feature-card"
import Map from "../../components/app/map/map"

import { connect } from 'react-redux'
import { userModalAction } from "../../data/actions/userActions"

//data funcs
import { 
    GetDatasets,
    GetIndicators,
    GetCountries,
    GetIndicator
} from "../../data/backend/datasets"
import ParseWEOData from "../../data/backend/weo-data"

function RandomElement(list) {
    let index = Math.floor(list.length * Math.random() | 0)
    return list[index]
}

async function GrabChartData() {
    let datasets = await GetDatasets()
    datasets     = datasets['datasets']
    let dataset  = RandomElement(datasets)
    
    let countries = await GetCountries(dataset)
    countries     = countries['countries']
    let country   = RandomElement(countries)

    let indicators = await GetIndicators(dataset, country['iso3'])
    indicators     = indicators['indicators']
    if(indicators.length == 0)
        return GrabChartData()

    let indicator  = RandomElement(indicators)
    let data = await GetIndicator(dataset, country['iso3'], indicator['ind3'])

    return {
        data: ParseWEOData(data['data']),
        indicator: indicator,
        country: country
    }
}

const Homepage = ({ userModalAction }) => {
    const [chartData, setChartData] = useState([])

    async function main() {
        let chart_data = []
        for(let i = 0; i < 3; i++)
            chart_data.push(await GrabChartData())
        setChartData([...chart_data])
    }

    useEffect(() => {
        main()
    }, [])
    
    return (
        <div className="homepage-wrapper">
            <div className="hero-wrap">
                <div className="hero-header">
                    <div className="hero-content">
                        <h1>Democratizing <span className="highlight">Data and Analysis</span> for everybody</h1>

                        <div className="description">
                            Visualize, Analyze, and Act faster. Leverage our powerful suite of tools aimed to 
                            increase your productivity and insights. 
                        </div>

                        <div className="actions">
                            <Button radius={"sm"} size={"sm"} onClick={() => { userModalAction(true) }}>
                                Get Started
                            </Button>
                        </div>

                        <Map />
                    </div>
                </div>
            </div>

            <div className="section fade-back" style={{ marginBottom: "7.5rem" }}>
                <div className="content">
                    <h2 className="header">Charts</h2>

                    <Container>
                        <Group position={"center"}>
                            <SimpleGrid
                                cols={3}
                            >
                                {chartData.map((step) => (
                                    <ChartCard 
                                        title={`${step.country.name} ${step.indicator.fullname}`}
                                        description={`${step.country.iso3}: ${step.indicator.ind3}`}
                                        data={step.data}
                                    />
                                ))}
                            </SimpleGrid>
                        </Group>
                    </Container>
                </div>
            </div>

            <div className="section dark">
                <div className="content">
                    <h2 className="header">Features</h2>
                    <h3 className="sub-header">Datasets | Analysis | Insights</h3>

                    <Container pb={"xl"} pt={"xl"}>
                        <Group position={"center"}>
                            <FeatureCard
                                title={"Diverse Datasets"}
                                description={"45+ indicators for 190+ countries, on GDP, Govt Finance, Trade, Employment and Investment from IMF WEO Dataset"}
                            />

                            <FeatureCard
                                title={"Beautiful Visualizations"}
                                description={"Dont let cookie cutter data visualizations, that limit the ways you can display and understand data hold your analysis back"}
                            />

                            <FeatureCard
                                title={"Faster Development"}
                                description={"Dont let complex tools and pipelines slow down your development, simplify the process by doing all your analysis on one platform"}
                            />
                        </Group>
                    </Container>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    
})

const mapDispatchToProps = dispatch => ({
    userModalAction: (payload) => dispatch(userModalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)
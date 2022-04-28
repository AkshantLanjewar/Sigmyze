import React, { useEffect } from "react"
import './homepage.scoped.scss'

import { 
    Button,
    Container,
    Group
} from "@mantine/core"

import ChartCard   from "./sub-components/chart-card"
import FeatureCard from "./sub-components/feature-card"
import Map from "../../components/app/map/map"

import { connect } from 'react-redux'
import { userModalAction } from "../../data/actions/userActions"

const Homepage = ({ userModalAction }) => {

    useEffect(() => {
    }, [])
    
    return (
        <div className="homepage-wrapper">
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

            <div className="section fade-back" style={{ marginBottom: "10rem" }}>
                <div className="content">
                    <h2 className="header">Charts</h2>

                    <Container mb={"xl"}>
                        <Group position={"center"}>
                            <ChartCard />
                            <ChartCard />
                            <ChartCard />
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
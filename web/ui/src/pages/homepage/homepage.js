import React, { useEffect } from "react"
import './homepage.scoped.scss'

import { 
    Button,
    Container,
    Group
} from "@mantine/core"

import ChartCard from "./sub-components/chart-card"
import Map from "../../components/app/map/map"

import { connect } from 'react-redux'
import { userModalAction } from "../../data/actions/userActions"

const Homepage = ({ userModalAction }) => {

    useEffect(() => {
    }, [])
    
    return (
        <div className="homepage-wrapper" style={{ marginBottom: "5rem" }}>
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

            <div className="section fade-back">
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
        </div>
    )
}

const mapStateToProps = state => ({
    
})

const mapDispatchToProps = dispatch => ({
    userModalAction: (payload) => dispatch(userModalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)
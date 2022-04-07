import React from "react"
import './about.scoped.scss'

import DescriptionCard from "./sub-components/desc-card"

import {
    Container,
    Grid
} from '@mantine/core'

import { BiBarChart }     from 'react-icons/bi'
import { IoIosAnalytics } from 'react-icons/io'
import { AiFillDatabase } from 'react-icons/ai'

const About = ({  }) => {
    return (
        <div className="about-wrapper">
            <div className="header">
                <h1>Who is Sigmyze for?</h1>
                <p>Whether you are an Analyst, a student, or just a hobbyist, we have your needs covered.</p>
            </div>

            <div className="section fade-back transparent">
                <Container size={"xl"}>
                    <Grid>
                        <Grid.Col span={3} offset={1}> 
                            <DescriptionCard
                                icon={<IoIosAnalytics />}
                                title={""}
                            /> 
                        </Grid.Col>

                        <Grid.Col span={3} offset={1}> 
                            <DescriptionCard 
                                icon={<BiBarChart />}
                                title={""}
                            /> 
                        </Grid.Col>

                        <Grid.Col span={3} offset={1}> 
                            <DescriptionCard 
                                icon={<AiFillDatabase />}
                                title={""}
                            /> 
                        </Grid.Col>
                    </Grid>
                </Container>
            </div>
        </div>
    )
}

export default About
import React from "react"
import './about.scoped.scss'

import DescriptionCard from "./sub-components/desc-card"
import Roadmap         from "./sub-components/roadmap"
import ContactForm     from "./sub-components/contact"

import {
    Container,
    Group
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
                    <Group grow spacing={"md"} position={"center"}>
                        <DescriptionCard
                            icon={<IoIosAnalytics />}
                            title={"Analytics"}
                            description={"Extract Insights"}
                            features={[
                                "Gain insights from unconventional data",
                                "Leverage powerful tools"
                            ]}
                        /> 
                        <DescriptionCard 
                            icon={<BiBarChart />}
                            title={"Charting"}
                            description={"Visualize and Display Data"}
                            features={[
                                "Multi Axis Charts",
                                "Multiple Chart Types",
                                "Exportable to PNG and SVG formats"
                            ]}
                        /> 
                        <DescriptionCard 
                            icon={<AiFillDatabase />}
                            title={"Data"}
                            description={"Readymade Datasets"}
                            features={[
                                "Leverage a wide variety of data types",
                                "Save time with precleaned data",
                                "Use WEO and WB data"
                            ]}
                        /> 
                    </Group>
                </Container>
            </div>

            <div className="section">
                <Container mt={"xl"} size={"lg"}>
                    <div className="header-container">
                        <h2 className="header">Roadmap</h2>
                    </div>

                    <Roadmap />
                </Container>
            </div>

            <div className="section">
                <Container mt={"xl"} size={"lg"}>
                    <div className="header-container">
                        <h2 className="header">Contact Us</h2>
                    </div>

                    <ContactForm />
                </Container>
            </div>
        </div>
    )
}

export default About
import React from "react"

import { HiPlus } from 'react-icons/hi'
import { AiOutlineAreaChart } from 'react-icons/ai'
import { RiGovernmentFill } from 'react-icons/ri'
import { BiFileBlank, BiMoney } from 'react-icons/bi'
import { GiShipBow } from 'react-icons/gi'
import { BsFillPeopleFill } from 'react-icons/bs'

import Modal from  '../../../components/modal/index'
import Project from '../components/project'

function LoggedView() {
    const templates = [
        { templateName: "Blank Project",         templateGroup: "STARTER",  icon: <BiFileBlank /> },
        { templateName: "GDP Project",           templateGroup: "ECONOMIC", icon: <AiOutlineAreaChart /> },
        { templateName: "Government Project",    templateGroup: "ECONOMIC", icon: <RiGovernmentFill /> },
        { templateName: "Investment Project",    templateGroup: "ECONOMIC", icon: <BiMoney /> },
        { templateName: "Commerce Project",      templateGroup: "ECONOMIC", icon: <GiShipBow /> },
        { templateName: "Demographic Project",   templateGroup: "ECONOMIC", icon: <BsFillPeopleFill /> }
    ]

    return (
        <div className="main dash-container">
            <div className="dash-header">
                <div className="text">
                    <h1>Welcome to Sigmyze</h1>
                    <p>Manage your projects, and get a head start with prebuilt templates</p>
                </div>

                <div className="buttons">
                    <button className="add">
                        <HiPlus />
                        <span>Create App</span>
                    </button>
                </div>
            </div>

            <section className="templates">
                <p className="header">Quick Start Templates</p>

                <div className="grid">
                    {templates.map(step => (
                        <div className="template">
                            <div className="body">
                                <div className="item">
                                    {step.icon}
                                </div>

                                <div className="item">
                                    <p>{step.templateName}</p>
                                    <div style={{fontSize: "10px"}}>{step.templateGroup}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="projects">
                <div className="title">
                    <p>My Projects</p>
                </div>

                <Project />
            </section>

            <Modal viewState={false} title={"Create Project"}>

            </Modal>
        </div>
    )
}

export default LoggedView
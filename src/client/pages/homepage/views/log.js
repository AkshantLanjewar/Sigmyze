import React from "react"

import { HiPlus } from 'react-icons/hi'
import Modal from  '../../../components/modal/index'

function LoggedView() {
    return (
        <div className="main dash-container">
            <div className="dash-header">
                <div className="text">
                    <h1>Welcome to Sigmyze</h1>
                    <p>Manage your apps, and get a head start with prebuilt templates</p>
                </div>

                <div className="buttons">
                    <button className="add">
                        <HiPlus />
                        <span>Create App</span>
                    </button>
                </div>
            </div>

            <section className="templates">
                <p className="header">Starter Templates</p>

                <div className="grid">
                    
                </div>
            </section>

            <section className="projects">

            </section>

            <Modal viewState={false} title={"Create Project"}>

            </Modal>
        </div>
    )
}

export default LoggedView
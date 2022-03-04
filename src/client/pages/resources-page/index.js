import React, { useEffect, useState } from "react"

import Dataset from './components/dataset-card'
import { FaBoxes, FaChartBar, FaGraduationCap } from 'react-icons/fa'



function ResourcesPage() {

    const [datasets, setDatasets] = useState([])

    useEffect(() => {
        const url = `/api/data/v2/datasets`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setDatasets(data.data)
            })
    }, [])

    return (
        <div className="info-page">
            <section className="dark">
                <div className="inner">
                    <h1>Datasets</h1>
                </div>
            </section>

            <section className="wave">
                <div className="card-container">
                    <div className="row">
                        <div className="card">
                            <div className="header">
                                <div className="circle-icon">
                                    <FaBoxes />
                                </div>
                                <h4>Wide Variety</h4>
                            </div>

                            <div className="body">
                                <p>
                                    Explore a wide variety of different datasets covering different topics.
                                    From Economic data, to the COVID pandemic, we have you covered. 
                                </p>
                            </div>
                        </div>

                        <div className="card">
                            <div className="header">
                                <div className="circle-icon">
                                    <FaChartBar />
                                </div>
                                <h4>Visuals</h4>
                            </div>

                            <div className="body">
                                <p>
                                    Easily create visualisations, without worrying about cleaning and processing 
                                    thousands of lines of data. 
                                </p>
                            </div>
                        </div>

                        <div className="card">
                            <div className="header">
                                <div className="circle-icon">
                                    <FaGraduationCap />
                                </div>
                                <h4>Accurate</h4>
                            </div>

                            <div className="body">
                                <p>
                                    Dont every worry about accuracy or revisions again. 
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="light">
                <div className="inner">
                    <div className="row title">
                        <h2>Available Datasets</h2>

                        <p>
                            Active Datasets currently hosted by Sigmyze
                        </p>
                    </div>

                    <div className="row datasets">
                        {datasets.map((step) => (
                            <Dataset dataset={step.name} onClickType={"datasets"} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ResourcesPage
import React, { useEffect, useState } from "react"

import { FaBoxes, FaChartBar, FaGraduationCap } from 'react-icons/fa'

function Dataset(props) {
    const [display, setDispay] = useState(true)
    const [dataInfo, setDataInfo] = useState({})

    const dataset = props.dataset
    let fileExtension = ".svg"
    if(dataset == "COVID")
        fileExtension = ".png"

    function OnDataset() {
        window.location.href = `/datasets/${dataset}`
    }

    useEffect(() => {
        let url = `/api/data/v2/datasets/${dataset}/info`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if(data.error) {
                    setDispay(false)
                    return
                }

                setDataInfo(data.data)
            })
    }, [])
    
    return (
        <div className="dataset" style={{ display: display ? "flex" : "none" }} onClick={OnDataset}>
            <div className="body">
                <div className="title">
                    <img src={`/logos/${dataset}${fileExtension}`} width={"50px"} height={"50px"} />
                    <h6>{dataInfo.fulltitle} ({dataset})</h6>
                </div>

                <div className="body">
                    <p>{dataInfo.desc}</p>
                </div>
            </div>
        </div>
    )
}

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
        <div className="resources">
            <section className="dark">

            </section>

            <section className="wave">
                <div className="card-container">
                    <div className="row">
                        <div className="card">
                            <FaBoxes />
                            <h4>Wide Variety</h4>

                            <p>
                                Explore a wide variety of different datasets covering different topics.
                                From Economic data, to the COVID pandemic, we have you covered. 
                            </p>
                        </div>

                        <div className="card">
                            <FaChartBar />
                            <h4>Visuals</h4>

                            <p>
                                Easily create visualisations, without worrying about cleaning and processing 
                                thousands of lines of data.
                            </p>
                        </div>

                        <div className="card">
                            <FaGraduationCap />
                            <h4>Accurate</h4>

                            <p>
                                Dont every worry about accuracy or revisions again. 
                            </p>
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
                        <Dataset dataset={"WEO"} />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ResourcesPage
import React, { useEffect, useState } from "react"

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
                            
                        </div>

                        <div className="card">
                            
                        </div>

                        <div className="card">
                            
                        </div>
                    </div>
                </div>
            </section>

            <section className="light">

            </section>
        </div>
    )
}

export default ResourcesPage
import React, { useState, useEffect } from "react"
import Dataset from "../../../pages/resources-page/components/dataset-card"

function DatasetView(props) {
    const [datasets, setDatasets] = useState([])
    const setActiveBtn = props.setActiveBtn
    const setDataset   = props.setDataset

    useEffect(() => {
        const url = `/api/data/v2/datasets`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                for(let i = 0; i < data.data.length; i++)
                    data.data[i]['active'] = false
                
                setDatasets(data.data)
            })
    }, [])

    function SetActive(dataset) {
        const stepName    = dataset.name
        let tmpDatasets   = datasets
        let activeDataset = null

        for(let i = 0; i < tmpDatasets.length; i++) {
            tmpDatasets[i]['active'] = false
            if(tmpDatasets[i].name == stepName) {
                tmpDatasets[i]['active'] = true
                activeDataset = tmpDatasets[i]
            }
        }

        setDatasets([...tmpDatasets])
        setActiveBtn(true)
        setDataset({...activeDataset})
    }

    return (
        <>
            {datasets.map((step) => (
                <Dataset dataset={step.name} active={step.active} onClickType={"adder"} onClickFN={() => { SetActive(step) }} />
            ))}
        </>
    )
}

export default DatasetView
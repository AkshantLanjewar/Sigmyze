import React, { useEffect, useState } from "react"

function Dataset(props) {
    const onClickType = props.onClickType
    const active      = props.active
    const [display, setDispay] = useState(true)
    const [dataInfo, setDataInfo] = useState({})

    const dataset = props.dataset
    let fileExtension = ".svg"
    if(dataset == "COVID")
        fileExtension = ".png"

    function OnDataset() {
        window.location.href = `/datasets/${dataset}`
    }

    let onClickFnc
    if(onClickType == "datasets")
        onClickFnc = OnDataset
    if(onClickType == "adder")
        onClickFnc = props.onClickFN

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
        <div className={`dataset ${active ? 'active' : ''}`} style={{ display: display ? "flex" : "none" }} onClick={onClickFnc}>
            <div className="inner">
                <div className="title">
                    <img src={`/logos/${dataset}${fileExtension}`} width={"70px"} height={"70px"} />
                    <h6>{dataInfo.fulltitle} ({dataset})</h6>
                </div>

                <div className="body">
                    <p>{dataInfo.desc}</p>
                </div>
            </div>
        </div>
    )
}

export default Dataset
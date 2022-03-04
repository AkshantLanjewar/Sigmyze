import React, { useState, useEffect } from "react"

function IndicatorView(props) {
    const dataset = props.dataset
    const [categories, setCategories] = useState([])

    useEffect(() => {
        let category_url = `/api/data/v2/datasets/${dataset}/categories`
        fetch(category_url)
            .then(response => response.json())
            .then(data => {
                if(data.error && data.msg == "dataset_404") {
                    setValidSet(false)
                    return
                }

                let rCategory = []

                for(let i = 0; i < data.data.length; i++)
                    rCategory.push({dataset: data.data[i].replace(dataset, ""), active: false})
                rCategory.splice(0, 0, { dataset: 'All', active: true })
                setCategories(rCategory)
            })
    }, [])

    return (
        <div>
            <div className="pills">
                <span className="pill">
                    <span className="content">All</span>
                </span>
            </div>

            <div className="table">

            </div>
        </div>
    )
}

export default IndicatorView
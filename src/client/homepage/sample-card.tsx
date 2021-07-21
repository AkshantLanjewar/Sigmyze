import React, { useEffect } from "react"

const SampleCard: React.FC<{}> = ({ children }) => {

    useEffect(() => {

    })

    return (
        <div className="sample-card">
            <div className="title tooltip">
                10yBOND/UNEM

                <span className="tooltiptext">10 Year Bonds / Unemployment</span>
            </div>

            <div className="chart">
                
            </div>
        </div>
    )
}

export default SampleCard
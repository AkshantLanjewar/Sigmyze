import React, { useEffect, useState } from "react"
import { GetIndicatorV, GetIndicatorDetails } from "../../../data/indicator"
import CreateChart from '../../../components/charts/lunar-charts'

function IndicatorView(props) {
    const activeCountry   = props.activeCountry
    const activeIndicator = props.activeIndicator
    const chartRef        = React.createRef()

    const [fullname, setFullname] = useState(null)
    const [units, setUnits] = useState(null)

    useEffect(() => {        
        async function anon() {
            let cData = []
            if(activeIndicator == null)
                return
            let data  = await GetIndicatorV(activeCountry.iso3, activeIndicator, props.dataset)
            let _data = data.data

            for(let i = 0; i < _data.length; i++) {
                let obj = {}
                let dt  = new Date(_data[i]["date"])

                if(props.dataset == "WEO")
                    obj['date'] = dt.getUTCFullYear()
                if(props.dataset == "COVID")
                    obj['date'] = dt

                obj['value'] = _data[i]["value"]
                cData.push(obj)
            } 

            let chartOpts = {
                container: chartRef,
                containerHeight: 328,
                type: 'line',
                name: "resources-overview-chart",
                dataset: props.dataset,
                data: cData
            }

            CreateChart(chartOpts)
            setFullname(data['fullname'])
            setUnits(data['units'])
        }

        chartRef.current.innerHTML = ''
        anon()
    }, [activeIndicator])

    return (
        <div>
            <div className="card-chart">
                <div className="title">
                    <h1>{activeCountry.fullname} - {fullname}</h1>
                    <h3>({units})</h3>
                </div>

                <div className="chart-container" ref={chartRef}></div>
            </div>

            <div className="chart-desc">
                <div className="chart-row">
                    {/**
                    <section>
                        <h4>Profile</h4>
                        <p>
                            Current account is all transactions other than those in financial and capital items. 
                            The major classifications are goods and services, income and current transfers. 
                            The focus of the BOP is on transactions (between an economy and the rest of the world) in goods, services, and income.
                        </p>
                    </section>

                    <section>
                        
                    </section> */}
                </div>
            </div>
        </div>
    )
}

export default IndicatorView
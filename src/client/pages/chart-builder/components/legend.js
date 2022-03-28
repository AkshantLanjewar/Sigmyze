import React, { useEffect, useState } from "react"
import * as getCountryISO2 from "country-iso-3-to-2"

function ChartLegend(props) {
    const chartList     = props.chartList
    const active_values = props.activeValues

    const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' })
    const [legend, setLegend]  = useState([])

    useEffect(() => {
        if(chartList.length == 0) {
            setLegend([])
            return
        }

        let indicators_view = []
        for(let i = 0; i < chartList.length; i++) {
            let data = chartList[i]

            let iso3 = data['iso3']
            let iso2 = getCountryISO2(iso3)

            let country_name = regionNamesInEnglish.of(iso2)
            let ind3     = data['ind3']
            
            let pack = {}
            pack['c_name']  = country_name
            pack['i_name']  = ind3
            pack['is_name'] = iso3
            pack['value']   = 0
            indicators_view.push(pack)
        }

        setLegend(indicators_view)
    }, [chartList])

    useEffect(() => {
        if(active_values.length == 0)
            return
        
        function insert_val(tmp_legend, pack) {
            let r_legend = []
            let t_iso3   = pack['iso3']
            let t_ind3   = pack['ind3']
            let value    = pack['value']

            for(let i = 0; i < tmp_legend.length; i++) {
                let   legend_itm = tmp_legend[i]
                const l_ind3     = legend_itm['i_name']
                const l_iso3     = legend_itm['is_name']

                if(l_ind3 == t_ind3 && l_iso3 == t_iso3)
                    legend_itm['value'] = value
                r_legend.push(legend_itm)
            }

            return r_legend
        }

        let tmp_legend = legend
        for(let i = 0; i < active_values.length; i++)
            tmp_legend = insert_val(tmp_legend, active_values[i])
    }, [active_values])

    return (
        <div className="chart-legend">
            {legend.map((step) => (
                <div className="element">
                    <div className="country">{step.c_name}</div>
                    <div className="indicator">{step.i_name}</div>
                    <div className="value">{step.value}</div>
                </div>
            ))}
        </div>
    )
}

export default ChartLegend
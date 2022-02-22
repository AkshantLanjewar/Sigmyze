import React, { useEffect } from "react"
import { GetIndicatorV } from "../../../data/indicator"

function IndicatorView(props) {
    const activeCountry   = props.activeCountry
    const activeIndicator = props.activeIndicator

    useEffect(() => {        
        async function anon() {
            if(activeIndicator == null)
                return

            let data = await GetIndicatorV(activeCountry.iso3, activeIndicator)
            console.log(data)
        }

        anon()
    }, [activeIndicator])

    return (
        <div>
            <div className="card-chart">
                <div className="title">
                    <h1>United States - Current AC Balance</h1>
                    <h3>(Billions)</h3>
                </div>

                <div className="chart-container">

                </div>
            </div>

            <div className="chart-desc">
                <div className="chart-row">
                    <section>
                        <h4>Profile</h4>
                        <p>
                            Current account is all transactions other than those in financial and capital items. 
                            The major classifications are goods and services, income and current transfers. 
                            The focus of the BOP is on transactions (between an economy and the rest of the world) in goods, services, and income.
                        </p>
                    </section>

                    <section>
                        
                    </section>
                </div>
            </div>
        </div>
    )
}

export default IndicatorView
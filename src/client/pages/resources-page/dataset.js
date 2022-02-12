import React from 'react'

import CountrySearch from './components/country-search'
import ChartCard from './components/chart-card'

import { AiOutlineLineChart } from 'react-icons/ai'

function DatasetPage() {
    return (
        <div className="datasets" style={{height: "100%"}}>
            <div className='inner'>
                <div className='header'>
                    <div className='title'>
                        <h1>World Economic Outlook</h1>
                        <h5>WEO</h5>
                    </div>

                    <CountrySearch />

                    <div className='tab-container' style={{marginTop: "-1em"}}>
                        <div className='tabs' style={{ justifySelf: "center" }}>
                            <ul>
                                <li>
                                    <a className='active'>
                                        <span><AiOutlineLineChart /></span>
                                        <span>GDP</span>
                                    </a>
                                </li>

                                <li>
                                    <a className=''>
                                        <span><AiOutlineLineChart /></span>
                                        <span>Trade</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className='body'>
                    <div className='tab-container' style={{ justifyContent: "flex-end" }}>

                    </div>
                    
                    <ChartCard iso3={"USA"} indicator={"NGDP"} />
                    <ChartCard iso3={"USA"} indicator={"NGDP"} />
                    <ChartCard iso3={"USA"} indicator={"NGDP"} />
                </div>
            </div>
        </div>
    )
}

export default DatasetPage
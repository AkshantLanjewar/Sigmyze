import React from "react"

function ResourcesPage() {
    return (
        <div className="resources">
            <header>
                <div className="inner">
                    <div className="t-row">
                        <h1>Datasets</h1>
                    </div>

                    <ul className="tabs">
                        <li className="active">
                            <a href="#" className="">View All</a>
                        </li>

                    </ul>
                </div>
            </header>

            <main>
                <div className="inner">
                    <div className="dataset">
                        <div className="body">
                            <div className="title">
                                <img src="/logos/IMF.svg" width={"50px"} height={"50px"} />
                                <h6>World Economic Outlook (WEO)</h6>
                            </div>

                            <div className="body">
                                <p>
                                    Dataset includes 45+ economic indicators for 190+ countries and regions under 5 primary categories - GDP, 
                                    Govt Finance, People, Trade and Investment. Savings and inflation are under Investment. 
                                    Data for most countries is from 1980 through 2026.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="dataset">
                        <div className="body">
                            <div className="title">
                                <img src="/logos/COVID.png" width={"50px"} height={"50px"} />
                                <h6>Coronavirus (COVID)</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ResourcesPage
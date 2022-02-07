import React from 'react';

import Navbar from '../../components/navbar'
import CategoryCard from './components/category-card'

import Carousel from '../../components/carousel'
import Map from './components/map'

import Logo from '../../svg/logo.svg';


function Homepage(props) {
    let viewcount = 3
    const windowWidth = window.innerWidth
    if(windowWidth <= 1200)
        viewcount = 2
    if(windowWidth <= 900)
        viewcount = 2
    if(windowWidth <= 500)
        viewcount = 1

    let cards = []
    for(let i = 0; i < 8; i++)
        cards.push(<CategoryCard category_a={"GDP"} category_b={"GOVT"} />)

    return (
        <div>
            <Navbar />

            <div className='main'>
                <header className='hero-banner'>
                    <div className='container'>
                        <img src={Logo} width={64} height={64} />
                        <h1 className='hero__title'>Sigmyze</h1>
                        <p className='hero__subtitle'>Democratizing Data and Analysis</p>
                    </div>

                    <div className='hero__map'>
                        <Map />
                    </div>
                </header>

                <main className='main'>
                    <section className='charts'>
                        <div className='container'>
                            <div className='row'>
                                <div className='headline'>
                                    <p className='category'>Charts</p>
                                    <h2 className="title">Splice & Analyze Different Datasets</h2>
                                </div>
                            </div>

                            <Carousel displayCount={viewcount}>
                                {cards}
                            </Carousel>
                        </div>
                    </section>

                    <section className='features'>
                        <div className='container'>
                            <div className="row">
                                <div className="headline">
                                    <p className="category">Features</p>
                                    <h2 className="title">Datasets | Analysis | Insights</h2>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col col--4">
                                    <div className="card dark" style={{minHeight: "258px"}}>
                                        <div className="header">
                                            <h2>Diverse Datasets</h2>
                                        </div>


                                        <div className="body" style={{marginTop: "1em"}}>
                                            <p>IMF WEO Dataset: 45+ indicators for 190+ countries, on GDP, Govt Finance, Trade, Employment and Investment</p>
                                            <br/>
                                            <p>Covid Dataset (Johns Hopkins): 4 indicators for 190+ countries, on cumulative & daily cases and deaths. Updated daily.</p>
                                            <br /><br />
                                            <h4>Coming Soon...</h4>
                                            <p>World Bank, US Weekly Jobs Data, Covid (state & county), and other datasets. </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col col--4">
                                    <div className="card dark" style={{minHeight: "258px"}}>
                                        <div className="header">
                                            <h2>Beautiful Visualizations</h2>
                                        </div>

                                        <div className="body" style={{marginTop: "1em"}}>
                                            <p>Dont let cookie cutter data visualizations, that limit the ways you can display and understand data hold your analysis back</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col col--4">
                                    <div className="card dark" style={{minHeight: "258px"}}>
                                        <div className="header">
                                            <h2>Faster Development</h2>
                                        </div>

                                        <div className="body" style={{marginTop: "1em"}}>
                                            <p>Dont let complex tools and pipelines slow down your development, simplify the process by doing all your analysis on one platform</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default Homepage

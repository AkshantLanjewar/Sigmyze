import React from 'react';

import Navbar from '../../components/navbar'
import Modal from '../../components/modal'
import CategoryCard from './components/category-card'

import Carousel from '../../components/carousel'
import Map from './components/map'

import Logo from '../../svg/logo.svg'; 

type HomepageState = {
    login_modal_open: boolean,
    viewcount: number,
    selectors: Array<"GDP" | "GOVT" | "INVEST">,
    cards: Array<JSX.Element>
};

class Homepage extends React.Component<{}, HomepageState> {
    constructor() {
        super({})

        let viewcount = 3
        //get the current screen dims
        const width = window.innerWidth
        if(width <= 1200)
            viewcount = 2
        if(width <= 900)
            viewcount = 2
        if(width <= 500)
            viewcount = 1

        let initalCards = []

        this.state = {
            login_modal_open: false,
            viewcount: viewcount,
            selectors: ["GDP", "GOVT"],
            cards: [<CategoryCard category_a={"GDP"} category_b={"GOVT"} />,
                    <CategoryCard category_a={"GDP"} category_b={"GOVT"} />,
                    <CategoryCard category_a={"GDP"} category_b={"GOVT"} />,
                    <CategoryCard category_a={"GDP"} category_b={"GOVT"} />,
                    <CategoryCard category_a={"GDP"} category_b={"GOVT"} />,
                    <CategoryCard category_a={"GDP"} category_b={"GOVT"} />,
                    <CategoryCard category_a={"GDP"} category_b={"GOVT"} />,
                    <CategoryCard category_a={"GDP"} category_b={"GOVT"} />,]
        }
    }

    render() {
        return (
            <div>
                <Navbar />

                <div className="main">
                    <header className="hero-banner">
                        <div className="container">
                            <img src={Logo} width={64} height={64} />
                            <h1 className="hero__title">Sigmyze</h1>
                            <p className="hero__subtitle">A Web Based Data Visualization and Analytics Platform</p>
                        </div>

                        <div className="hero__map">
                            <Map />
                        </div>
                    </header>

                    <main className="main">
                        <section className="charts">
                            <div className="container">
                                <div className="row">
                                    <div className="headline">
                                        <span className="category">Charts</span>
                                        <h2 className="title">Splice different data points together</h2>
                                    </div>
                                </div>

                                <Carousel displayCount={this.state.viewcount}>
                                    {this.state.cards}
                                </Carousel>
                            </div>
                        </section>

                        <section className="features">
                            <div className="container">
                                <div className="row">
                                    <div className="headline">
                                        <span className="category">Features</span>
                                        <h2 className="title">Form new hypothesis from existing data</h2>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col col--4">
                                        <div className="card dark" style={{minHeight: "258px"}}>
                                            <div className="header">
                                                <h3>Diverse Datasets</h3>
                                            </div>

                                            <div className="body">
                                                <p>Answer your questions with a large variety of WEO Datasets that cover GDP to investment</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col col--4">
                                        <div className="card dark" style={{minHeight: "258px"}}>
                                            <div className="header">
                                                <h3>Beautiful Visualizations</h3>
                                            </div>

                                            <div className="body">
                                                <p>Dont let cookie cutter data visuazation options, that limit the ways you can display data hold your analysis back</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col col--4">
                                        <div className="card dark" style={{minHeight: "258px"}}>
                                            <div className="header">
                                                <h3>Faster Development</h3>
                                            </div>

                                            <div className="body">
                                                <p>Dont let complex tools and pipelines slow down your development, simplify the process by doing all your analysis on one platform</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>

                <Modal show={this.state.login_modal_open} maxWidth={450}>
                   
                </Modal>
            </div>
        )
    }
}

export default Homepage
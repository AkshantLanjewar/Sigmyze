import React from 'react';

import Navbar from '../../components/navbar'
import Modal from '../../components/modal'
import Loginform from './components/login-form'

import CircleSelector from './components/circle-selector'

import SampleCard from './components/sample-card'
import CategoryCard from './components/category-card'

import Carousel from './components/carousel'
import Map from './components/map'

type HomepageState = {
    login_modal_open: boolean,
    viewcount: number,
    selectors: Array<"GDP" | "GOVT" | "INVEST">,
    cards: Array<JSX.Element>
};

class Homepage extends React.Component<{}, HomepageState> {
    constructor() {
        super({})

        let viewcount = 4
        //get the current screen dims
        const width = window.innerWidth
        if(width <= 1200)
            viewcount = 3
        if(width <= 900)
            viewcount = 2
        if(width <= 500)
            viewcount = 1

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

        this.updateSelector = this.updateSelector.bind(this)
    }

    updateSelector(index: number, selectorID: "GDP" | "GOVT" | "INVEST") {
        let selectors = this.state.selectors
        selectors[index] = selectorID

        let nCards = []
        for(let i = 0; i < 8; i++)
            nCards.push(<CategoryCard category_a={selectors[0]} category_b={selectors[1]} />)

        this.setState({...this.state, selectors: selectors, cards: nCards})
    }

    render() {
        return (
            <div>
                <Navbar />
    
                <div className="page-container">

                    <div className="title-text">
                        <h1>
                            <span className="main">Data Analysis. </span>
                            <span className="sub">Without the pain of complex tools</span>
                        </h1>

                        {/*<button className="login-button" onClick={() => {this.setState({...this.state, login_modal_open: true})}}>
                            Get Started, its free
                        </button>*/}
                    </div>
                    

                    <section className="samples">
                        <div className="sample-selectors">
                            <CircleSelector inital_category={this.state.selectors[0]} index={0} updateSelected={this.updateSelector} />
                            <CircleSelector inital_category={this.state.selectors[1]} index={1} updateSelected={this.updateSelector} />
                        </div>
                        
                        <Carousel displayCount={this.state.viewcount}>
                            {this.state.cards}
                        </Carousel>
                    </section>

                    <section className="title-text" style={{marginBottom: "32px"}}>
                        <h1>
                            <span className="main">New Tools. </span>
                            <span className="sub">To help you create innovative visualizations</span>
                        </h1>
                    </section>

                    <Map />
                </div>

                <Modal show={this.state.login_modal_open} maxWidth={450}>
                    <Loginform closeModal={() => { this.setState({...this.state, login_modal_open: false}) }} />
                </Modal>
            </div>
        )
    }
}

export default Homepage
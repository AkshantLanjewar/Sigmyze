import React from 'react';

import Navbar from '../../components/navbar'
import Modal from '../../components/modal'
import Loginform from './components/login-form'

import SampleCard from './components/sample-card'
import Carousel from './components/carousel'
import Map from './components/map'

type HomepageState = {
    login_modal_open: boolean,
    viewcount: number
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
            viewcount: viewcount
        }
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
                            swag
                        </div>
                        
                        <Carousel displayCount={this.state.viewcount}>
                            <SampleCard />
                            <SampleCard />
                            <SampleCard />
                            <SampleCard />
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
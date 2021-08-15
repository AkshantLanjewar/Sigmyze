import React from 'react';
import './sass/homepage.scss';

import Navbar from '../../components/navbar'
import Modal from '../../components/modal'
import Loginform from './components/login-form'

import SampleCard from './components/sample-card'
import Carousel from './components/carousel'
import Map from './components/map'

type HomepageState = {
    login_modal_open: boolean
};

class Homepage extends React.Component<{}, HomepageState> {
    constructor() {
        super({})

        this.state = {
            login_modal_open: false
        }
    }

    render() {
        return (
            <div>
                <Navbar />
    
                <div className="home-container">
                    <h1 className="jumbo-text">Get Analysis Faster</h1>
                    <h3 className="jumbo-subtext">Dont let Complicated tools and unclean data slow you down <br />
                    Get your analysis in one place without having to bounce around and learn new tools</h3>
                    {/*<button className="login-button" onClick={() => {this.setState({...this.state, login_modal_open: true})}}>
                        Get Started, its free
                    </button> */}

                    <section className="samples">
                        <Carousel displayCount={4}>
                            <SampleCard />
                            <SampleCard />
                            <SampleCard />
                            <SampleCard />
                        </Carousel>
                    </section>

                    <section className="map-text">
                        <h2>Limitless Possibilities</h2>
                        <h4>Dont be restricted to just classical forms of Data Visualization</h4>
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
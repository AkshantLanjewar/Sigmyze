import React from 'react';
import './sass/homepage.scss';

import Navbar from '../components/navbar'
import Modal from '../components/modal'
import Loginform from './login-form'

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
                    <h1 className="jumbo-text">Run your Buisness Faster</h1>
                    <h3 className="jumbo-subtext">Dont let unorganized papertrails slow you down, <br />
                    Get organized fast without the pain of learning a new tool</h3>
                    <button className="login-button" onClick={() => {this.setState({...this.state, login_modal_open: true})}}>
                        Login, its free
                    </button>
                </div>

                <Modal show={this.state.login_modal_open} maxWidth={450}>
                    <Loginform closeModal={() => { this.setState({...this.state, login_modal_open: false}) }} />
                </Modal>
            </div>
        )
    }
}

export default Homepage
import React from "react"
import './home.scss'

import Navbar from "../../components/navigation"
import Modal from "../../components/modal"
import LoginForm from "./login-form"

class Homepage extends React.Component {
    constructor() {
        super()

        this.state = {
            login_modal_open: false
        }
    }

    render() {
        return (
            <div>
                <Navbar />

                <div className="home-container">
                    <h1 class="jumbo-text">Build Better Apps Faster</h1>
                    <h3 class="jumbo-subtext">Build your applications with speed and finesse, <br />
                    harnessing the power of data without thousands of lines of code</h3>
                    <button class="login-button" onClick={() => {this.setState({...this.state, login_modal_open: true})}}>Login, its free</button>
                </div>

                <Modal show={this.state.login_modal_open} maxWidth={450}>
                    <LoginForm closeModal={() => { this.setState({...this.state, login_modal_open: false}) }} />
                </Modal>
            </div>
        )
    }   
}

export default Homepage
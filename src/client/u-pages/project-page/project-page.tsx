import React from 'react';
import Project from './project'

import './sass/project-page.scss'

import { BsChevronDown } from 'react-icons/bs'

import BuisnessForm from './create-buisness-form'

const Sidebar: React.FC<{}> = ({children}) => {
    return (
        <div className="sidebar">
            <h4>Lunar Dashboard</h4>

            <div className="panel">
                <span className="panel-title"></span>

                <ul className="panel-items">
                    <li className="panel active">Businesses</li>
                </ul>
            </div>
        </div>
    )
}

type State = {
    createFormOpen: boolean
}

class Projectpage extends React.Component<{}, State> {
    constructor() {
        super({})

        this.state = {
            createFormOpen: false
        }

        this.closeModal = this.closeModal.bind(this)
    }

    closeModal() {
        this.setState({...this.state, createFormOpen: false})
    }

    render() {
        return (
            <div className="project-wrap">

                <BuisnessForm show={this.state.createFormOpen} closeModal={this.closeModal} />

                <Sidebar />

                <div className="main-content">
                    <div className="navbar">
                        <div className="user">
                            <div className="dropdown-vis">
                                <img 
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4jl4brp2ydg6whW45gTbgpeg8BOlQV0_73g&usqp=CAU" 
                                />

                                <BsChevronDown />
                            </div>

                            <div className="dropdown-content">
                                <ul className="dropdown">
                                    <li>Signout</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="buisness">
                        <div className="header">
                            <h3>Businesses</h3>

                            <button className="create" 
                            onClick={() => { this.setState({...this.state, createFormOpen: true}) }}>
                                Create new Business
                            </button>
                        </div>

                        <div className="projects">
                            <Project />
                            <Project />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Projectpage
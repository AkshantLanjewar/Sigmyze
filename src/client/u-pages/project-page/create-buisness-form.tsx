import React from "react"
import './sass/create-form.scss'

import Modal from '../components/modal'

import { FiX } from 'react-icons/fi'

type Props = {
    closeModal: Function,
    show: boolean
}

type State = {
    currentFormState: string
}

class BuisnessForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            currentFormState: "name"
        }

        this.nextButton = this.nextButton.bind(this)
        this.prevButton = this.prevButton.bind(this)
    }

    nextButton(e: any) {
        e.preventDefault()

        if(this.state.currentFormState == "name")
            this.setState({...this.state, currentFormState: "check"})
        if(this.state.currentFormState == "check") {
            // collect form data
        }
    }

    prevButton(e: any) {
        e.preventDefault()

        if(this.state.currentFormState == "check")
            this.setState({...this.state, currentFormState: "name"})
    }

    render() {

        let nameFormClasses  = "form-part"
        let checkFormClasses = "form-part"

        let prevButtonClasses = ""
        let nextButtonText = "Next"
        
        if(this.state.currentFormState == "name") {
            nameFormClasses = nameFormClasses + " active"
            nextButtonText = "Next"
            prevButtonClasses = "muted"
        }
        if(this.state.currentFormState == "check") {
            checkFormClasses = checkFormClasses + " active"
            nextButtonText = "Submit"
        }

        return (
            <Modal show={this.props.show} maxWidth={450}>
                <div className="create-form">
                    <div className="header">
                        <div className="row">
                            <h3 className="create-title">Create a Business</h3>
                            <FiX onClick={() => { this.props.closeModal() }} />
                        </div>
                    </div>
    
                    <div className="form-container">
                        <form>
                            <div className={nameFormClasses}>
                                <div className="form-container">
                                    <div className="label">
                                        <label htmlFor="b-name">Business Name</label>
                                    </div>

                                    <div className="input">
                                        <input className="text" 
                                            type="text" 
                                            name="b-name" 
                                            placeholder="Enter the name of your business ..." />
                                    </div>
                                </div>
                            </div>

                            <div className={checkFormClasses}>
                                <div className="form-container">
                                    <div className="label">
                                        <label htmlFor="featuresTitle">Enabled Features</label>
                                        <p className="subtext">Features can be enabled later</p>
                                    </div>

                                    <div className="check-input">
                                        <input className="checkbox" type="checkbox" name="option_1" value="Contacts" checked />
                                        <label htmlFor="option_1">Contacts</label><br />
                                    </div>
                                    <div className="check-input">
                                        <input className="checkbox" type="checkbox" name="option_2" value="Document & File Storage" checked />
                                        <label htmlFor="option_2">Document & File Storage</label><br />
                                    </div>
                                    <div className="check-input">
                                        <input className="checkbox" type="checkbox" name="option_3" value="Project Management" checked />
                                        <label htmlFor="option_3">Project Management</label><br />
                                    </div>
                                    <div className="check-input">
                                        <input className="checkbox" type="checkbox" name="option_4" value="Calendar" checked />
                                        <label htmlFor="option_4">Calendar</label><br />
                                    </div>

                                </div>
                            </div>

                            <div className="part-btn">
                                <button onClick={this.prevButton} className={prevButtonClasses}>Previous</button>
                                <button onClick={this.nextButton}>{nextButtonText}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default BuisnessForm
import React from "react"
import './homepage.scoped.scss'

import Button from "../../components/basic/buttons/button"

import { connect } from 'react-redux'
import { userModalAction } from "../../data/actions/userActions"

const Homepage = ({ userModalAction }) => {
    
    return (
        <div className="homepage-wrapper">
            <div className="hero-header">
                <div className="hero-content">
                    <h1>Democratizing <span className="highlight">Data and Analysis</span> for everybody</h1>

                    <div className="description">
                        Visualize, Analyze, and Act faster. Leverage our powerful suite of tools aimed to 
                        increase your productivity and insights. 
                    </div>

                    <div className="actions">
                        <Button padding={"md"} pColor={"blue"} grow={false} sxOnClick={() => { userModalAction(true) }}>
                            <Button.Text>Get Started</Button.Text>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="features">

            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    
})

const mapDispatchToProps = dispatch => ({
    userModalAction: (payload) => dispatch(userModalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)
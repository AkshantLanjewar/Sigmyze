import React, { useEffect, useState } from "react"
import './homepage.scoped.scss'
import { connect } from 'react-redux'
import { userModalAction } from "../../data/actions/userActions"


import DefaultPage from "./views/default"
import Dashboard   from "./views/dashboard"

const Homepage = ({ userModalAction, user }) => {
    const [homepageState, setHomepageState] = useState(false)

    useEffect(() => {
        let userState = user.userState

        if(userState == 'logged_in')
            setHomepageState(true)
        else
            setHomepageState(false)
    }, [user])
    
    return (
        <div>
            {homepageState
                ? <Dashboard user={user} />
                : <DefaultPage user={user} userModalAction={userModalAction} />
            }
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    userModalAction: (payload) => dispatch(userModalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)
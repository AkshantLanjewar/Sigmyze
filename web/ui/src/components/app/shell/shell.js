import React, { useState, useEffect } from "react"
import './shell.scoped.scss'

import { connect } from "react-redux"

const AppShell = ({ children, user }) => {
    const [expandedState, setExpandedState] = useState(false)
    const [hasMain, setHasMain]             = useState(false)
    const [hasSide, setHasSide]             = useState(false)

    const main = React.Children.map(children, child => child.type.displayName === 'main' ? child : null)
    const side = React.Children.map(children, child => child.type.displayName === 'side' ? child : null)

    function CheckUserState() {
        let userState = user.userState
        let urlPath   = window.location.pathname

        if(userState == "logged_in" && urlPath == "/")
            setExpandedState(true)
        else
            setExpandedState(false)
    }

    useEffect(() => {
        CheckUserState()
    }, [])

    useEffect(() => {
        CheckUserState()
    }, [user.userState])

    useEffect(() => {
        if(main != undefined && main.length > 0)
            setHasMain(true)
        if(side != undefined && side.length > 0)
            setHasSide(true)
    }, [children])

    return (
        <div className="shell">
            {hasSide ? React.cloneElement(side[0], { expandedState: expandedState }) : null}
            {hasMain ? React.cloneElement(main[0], { expandedState: expandedState, expandAside: setExpandedState }) : null}
        </div>
    )
}

const AppMain = ({ expandedState, expandAside, children }) => {
    const [expandUse, setExpandUse]         = useState(false)
    const [cloneChildren, setCloneChildren] = useState(false)

    useEffect(() => {
        if(expandAside != undefined)
            setExpandUse(true)
        if(children != undefined)
            setCloneChildren(true)
    }, [expandAside, children])

    let injectedProps = expandUse ? {
        expandAside: expandAside,
        expandedState: expandedState
    } : {}

    return (
        <div className="main">
            {cloneChildren ? children.map((step) => React.cloneElement(step, {...injectedProps})) : null}
        </div>
    )
}
AppMain.displayName = "main"
AppShell.Main = AppMain

const AppSide = ({ expandedState, children }) => {
    const [expandUse, setExpandUse]         = useState(false)
    const [cloneChildren, setCloneChildren] = useState(false)

    useEffect(() => {
        if(expandedState != undefined)
            setExpandUse(true)
        if(children != undefined)
            setCloneChildren(true)
    }, [expandedState, children])

    let injectedProps = expandUse ? {
        expanded: expandedState
    } : {}

    return (
        <div className={`side ${expandedState ? 'expanded' : ''}`}>
            {cloneChildren ? React.cloneElement(children, {...injectedProps}) : null}
        </div>
    )
}
AppSide.displayName = "side"
AppShell.Side = AppSide

const mapStateToProps = state => ({
	user: state.user
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(AppShell)
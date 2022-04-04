import React, { useState, useEffect } from "react"
import './navbar.scoped.scss'

import { RiMenu3Line } from 'react-icons/ri'

import UserNavbar from "../user-navbar/user-navbar"

import { connect } from 'react-redux'
import { userModalAction } from "../../../data/actions/userActions"

const Navbar = ({ userModal, userModalAction, expandAside }) => {
    const [togglerState, setTogglerState] = useState(false)
    useEffect(() => {
        expandAside(togglerState)
    }, [togglerState])

    return (
        <div className="navbar">
            <div>
                <button className={`toggler ${togglerState ? 'toggled' : ''}`}
                    onClick={() => { setTogglerState(!togglerState) }}>
                    <RiMenu3Line />
                </button>
            </div>

            <UserNavbar userModal={userModal} userModalAction={userModalAction} />
        </div>
    )
}

const mapStateToProps = state => ({
    userModal: state.userModal
})

const mapDispatchToProps = dispatch => ({
    userModalAction: (payload) => dispatch(userModalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
import React, { useState, useEffect } from "react"
import './navbar.scoped.scss'

import { RiMenu3Line } from 'react-icons/ri'

import UserNavbar from "../user-navbar/user-navbar"

import { connect } from 'react-redux'
import { userModalAction } from "../../../data/actions/userActions"

const Navbar = ({ userState, userModal, userModalAction, expandAside, expandedState }) => {
    const [driveActive, setDriveActive] = useState(false)

    return (
        <div className={`navbar ${ expandedState ? 'expand' : '' }`}>
            <div>
                <button className={`toggler ${expandedState ? 'toggled' : ''}`}
                    onClick={() => { expandAside(!expandedState) }}>
                    <RiMenu3Line />
                </button>
            </div>

            <UserNavbar userModal={userModal} userModalAction={userModalAction} />
        </div>
    )
}

const mapStateToProps = state => ({
    userState: state.user.userState,
    userModal: state.user.userModal
})

const mapDispatchToProps = dispatch => ({
    userModalAction: (payload) => dispatch(userModalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
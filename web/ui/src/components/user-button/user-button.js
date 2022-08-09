import React, { useEffect, useState } from "react"

import { connect } from "react-redux"
import { 
    userModalAction, 
    verifyModalAction, 
    authAction,
    userDataAction 
} from "../../data/actions/userActions"

import { 
    Button
} from "@mantine/core"

import UserControl    from "./user-control"

let time_diff = 1000 * 60 * 5

const UserButton = ({ userModalAction, verifyModalAction, authAction, userDataAction, user }) => {
    //manage the refreshing of the token here
    async function ManageAuthState(user) {
        const jwt_token = user.jwtToken
        const u_state   = user.userState

        if(jwt_token == "" || u_state == "signedout" || jwt_token == undefined)
            return

        let timestamp = localStorage.getItem("jwt_stamp")
        if(timestamp == null) {
            let n_timestamp = new Date().getTime()
            localStorage.setItem("jwt_stamp", n_timestamp)
            timestamp = n_timestamp
        }

        timestamp = parseInt(timestamp)
        if(new Date().getTime() - timestamp > 1000 * 60 * 5) {
            localStorage.setItem("jwt_stamp", new Date().getTime())
            console.log("[Lunar DEBUG] : Refreshing Token")

            fetch("/api/v1/auth/refresh-token", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt_token}` 
                }
            }).then(res => {
                let data = res.json()

                const n_token = data.token
                authAction({
                    jwtToken: n_token,
                    verified: user.verified,
                    userState: user.userState
                })
            })
        }
    }

    const [userData, setUserData] = useState({
        email: "",
        username: "",
        role: ""
    })

    useEffect(() => {
        ManageAuthState(user)
        GrabUserData()
    }, [])

    useEffect(() => {
        GrabUserData()
    }, [user.jwtToken])

    function GrabUserData() {
        let token = user.jwtToken
        if(token == "" || token == undefined)
            return

        fetch("/api/v1/auth/user-data", {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}`}
        }).then(resp => resp.json()).then(data => {
            setUserData({
                email: data.email,
                username: data.username,
                role: data.role
            })

            userDataAction({
                email: data.email,
                username: data.username,
                role: data.role
            })
        })  
    }

    setInterval(() => { ManageAuthState(user) }, 30000)

    function Logout() {
        fetch("/api/v1/auth/revoke-token", {
            method: "POST",
            
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.jwtToken}` 
            }
        }).then(res => res.json()).then(data => {
            authAction({
                jwtToken: "",
                verified: "no",
                userState: "signedout"
            })
        })

        authAction({
            jwtToken: "",
            verified: "no",
            userState: "signedout"
        })

        window.location.replace('/')
    }

    return (
        <div>
            {user.userState == "signedout"
                ? <Button onClick={() => { userModalAction(true) }}>Login</Button>
                : (
                    <div>
                        {user.userState == "verify"
                            ? <Button onClick={() => { verifyModalAction(true) }}>Verify</Button>
                            : <UserControl 
                                username={userData.username} 
                                email={userData.email} 
                                logout={Logout}
                            />
                        }
                    </div>
                )
            }
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    userModalAction: (payload) => dispatch(userModalAction(payload)),
    verifyModalAction: (payload) => dispatch(verifyModalAction(payload)),
    authAction: (payload) => dispatch(authAction(payload)),
    userDataAction: (payload) => dispatch(userDataAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserButton)
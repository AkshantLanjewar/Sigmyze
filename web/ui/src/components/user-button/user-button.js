import React, { useEffect, useState } from "react"

import { connect } from "react-redux"
import { userModalAction, verifyModalAction, authAction } from "../../data/actions/userActions"

import { 
    Button,
    Avatar,
    Menu,
    Divider,
    Group,
    Text 
} from "@mantine/core"

import { VscSignOut } from 'react-icons/vsc'

const UserControl = ({ username, email, logout }) => (
    <div>
        <Menu 
            control={<Avatar src={null} alt={username} color={"blue"}>AL</Avatar>}
            size={300}
            withArrow
        >
            <Menu.Item>
                <Group>
                    <Avatar 
                        radius={"xl"}
                        src={null}
                        alt={username}
                        color={"blue"}
                    >
                        AL
                    </Avatar>

                    <div>
                        <Text weight={500}>{username}</Text>
                        <Text size={"xs"} color={"dimmed"}>
                            {email}
                        </Text>
                    </div>
                </Group>
            </Menu.Item>

            <Divider />

            <Menu.Item icon={<VscSignOut size={14} />} onClick={logout}>Logout</Menu.Item>
        </Menu>
    </div>
)

const UserButton = ({ userModalAction, verifyModalAction, authAction, user }) => {
    //manage the refreshing of the token here
    async function ManageAuthState(user) {
        const jwt_token = user.jwt_token
        const u_state   = user.userState

        if(jwt_token == "" || u_state == "signedout")
            return

        fetch("/api/v1/auth/refresh-token", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
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

    const [userData, setUserData] = useState({
        email: "",
        username: ""
    })

    useEffect(() => {
        ManageAuthState()
        GrabUserData()
    }, [])

    useEffect(() => {
        GrabUserData()
    }, [user.jwtToken])

    function GrabUserData() {
        let token = user.jwtToken
        if(token == "")
            return

        fetch("/api/v1/auth/user-data", {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}`}
        }).then(resp => resp.json()).then(data => {
            setUserData({
                email: data.email,
                username: data.username
            })
        })  
    }

    setInterval(ManageAuthState, 60000 * 40)

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
    authAction: (payload) => dispatch(authAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserButton)
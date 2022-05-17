import React from "react"

import { connect } from "react-redux"
import { userModalAction, verifyModalAction } from "../../data/actions/userActions"

import { 
    Button,
    Avatar,
    Menu,
    Divider,
    Group,
    Text 
} from "@mantine/core"

import { VscSignOut } from 'react-icons/vsc'

const UserControl = ({ username, email }) => (
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

            <Menu.Item icon={<VscSignOut size={14} />}>Logout</Menu.Item>
        </Menu>
    </div>
)

const UserButton = ({ userModalAction, verifyModalAction, user }) => {
    return (
        <div>
            {user.userState == "signedout"
                ? <Button onClick={() => { userModalAction(true) }}>Login</Button>
                : (
                    <div>
                        {user.userState == "verify"
                            ? <Button onClick={() => { verifyModalAction(true) }}>Verify</Button>
                            : <UserControl username={"Akshant Lanjewar"} email={"akshant.lanjewar@gmail.com"} />
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
    verifyModalAction: (payload) => dispatch(verifyModalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserButton)
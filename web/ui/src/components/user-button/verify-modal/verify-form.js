import React from "react"

import { showNotification } from '@mantine/notifications'
import { useForm } from "@mantine/hooks"

import { 
    Group,
    TextInput,
    Anchor,
    Button
} from "@mantine/core"

import { connect }    from "react-redux"
import { authAction } from "../../../data/actions/userActions"

const VerifyForm = ({ user, authAction }) => {
    const form = useForm({
        initialValues: {
            token: ''
        },
    })

    function OnSubmit(e) {
        e.preventDefault()

        let token = form.values.token
        const p_data = {
            code: token,
            token: user.jwtToken
        }

        fetch("/api/v1/auth/verify", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p_data)
        }).then(res => {
            let data     = res.json()
            let verified = data.verified

            if(!verified) {
                let msg = data.message
                
                if(msg == "user_dne")
                    showNotification({
                        title: "Verify Error",
                        message: "The user does not exist",
                        color: 'red',
                        autoClose: 1000 * 10
                    })
                if(msg == "alr_verified")
                    showNotification({
                        title: "Verify Error",
                        message: "User already verified",
                        color: 'red',
                        autoClose: 1000 * 10
                    })
                if(msg == "no_match")
                    showNotification({
                        title: "Verify Error",
                        message: "Verification code does not match",
                        color: 'red',
                        autoClose: 1000 * 10
                    })

                return
            }

            let verified_val = "yes"
            let user_state   = "logged_in"
            let payload      = {
                jwtToken: user.jwtToken,
                verified: verified_val,
                userState: user_state
            }

            authAction(payload)
        })
    }

    function ResendVerificationEmail(e) {
        e.preventDefault()
    }

    return (
        <form onSubmit={OnSubmit}>
            <Group direction={"column"} grow>
                <TextInput
                    required
                    label="Code"
                    placeholder="Your Code"
                    value={form.values.token}
                    onChange={(event) => form.setFieldValue('token', event.currentTarget.value)}
                />
            </Group>

            <Group position={"apart"} mt={"xl"}>
                <Anchor component={"button"} type={"button"} color={"gray"} size={"xs"}>
                    Didnt get the email? Send it again
                </Anchor>

                <Button type={"submit"}>Verify</Button>
            </Group>
        </form>
    )
}

const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    authAction: (payload) => dispatch(authAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(VerifyForm)
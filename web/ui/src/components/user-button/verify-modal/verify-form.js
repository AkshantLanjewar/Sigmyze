import React from "react"

import { showNotification } from '@mantine/notifications'
import { useForm } from "@mantine/form"

import { 
    Group,
    TextInput,
    Anchor,
    Button,
    Stack
} from "@mantine/core"

import { connect }    from "react-redux"
import { authAction } from "../../../data/actions/userActions"

const VerifyForm = ({ user, authAction, modalAction, setLoading }) => {
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

        setLoading(true)
        fetch("/api/v1/auth/verify", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.jwtToken}`  
            },
            body: JSON.stringify(p_data)
        }).then(res => res.json()).then(data => {
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
                
                setLoading(false)
                return
            }

            let verified_val = "yes"
            let user_state   = "logged_in"
            let n_token      = data.token

            let payload      = {
                jwtToken: n_token,
                verified: verified_val,
                userState: user_state
            }

            authAction(payload)
            setLoading(false)
            modalAction(false)
        })
    }

    function ResendVerificationEmail(e) {
        e.preventDefault()

        const p_data = {
            token: user.jwtToken
        }

        fetch("/api/v1/auth/resend-verification", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.jwtToken}` 
            },
            body: JSON.stringify(p_data)
        }).then(res => res.json()).then(data => {
            const resent = data['resent']

            if(resent)
                showNotification({
                    title: "Verify System",
                    message: "Verification Code Resent",
                    color: 'green',
                    autoClose: 1000 * 10
                })
        })
    }

    return (
        <form onSubmit={OnSubmit}>
            <Stack>
                <Stack direction={"column"} grow>
                    <TextInput
                        required
                        label="Code"
                        placeholder="Your Code"
                        value={form.values.token}
                        onChange={(event) => form.setFieldValue('token', event.currentTarget.value)}
                    />
                </Stack>

                <Group position={"apart"} mt={"xl"}>
                    <Anchor component={"button"} type={"button"} color={"gray"} size={"xs"} onClick={ResendVerificationEmail}>
                        Didnt get the email? Send it again
                    </Anchor>

                    <Button type={"submit"}>Verify</Button>
                </Group>
            </Stack>
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
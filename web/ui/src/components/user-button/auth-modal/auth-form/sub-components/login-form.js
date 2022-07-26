import React, { useState } from "react"

import { useForm } from "@mantine/form";
import { showNotification } from '@mantine/notifications'

import {
    TextInput,
    PasswordInput,
    Group,
    Button,
    Anchor,
    Stack
} from '@mantine/core';

import { connect } from "react-redux"
import { authAction, userModalAction } from "../../../../../data/actions/userActions"

const LoginForm = ({ changeState, authAction, userModalAction, setLoading }) => {
    const [iconState, setIconState] = useState(false)
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validationRules: {
            email: (val) => /^\S+@\S+$/.test(val),
            password: (val) => val.length >= 6,
        }
    })

    function HandleChangeClick(e) {
        e.preventDefault()
        changeState(true)
    }

    function onSubmit(e) {
        e.preventDefault()

        const email  = form.values.email
        const pwd    = form.values.password
        const p_data = {
            email: email,
            password: pwd
        }

        setLoading(true)
        fetch("/api/v1/auth/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p_data)
        }).then(res => res.json()).then(data => {
            let auth = data.authorized
            if(!auth) {
                let message = data.message
                
                if(message == "user_dne")
                    showNotification({
                        title: "Login Error",
                        message: "The email you typed has no associated account with us",
                        color: 'red',
                        autoClose: 1000 * 10
                    })
                if(message == "pwd_bad")
                    showNotification({
                        title: "Login Error",
                        message: "The password you typed in did not match",
                        color: 'red',
                        autoClose: 1000 * 10
                    })
                
                setLoading(false)
                return
            }
            
            let verified   = data.verified
            let jwt_token  = data.token

            let user_state = "verify"
            if(verified == "yes")
                user_state = "logged_in"

            let payload = {
                jwtToken: jwt_token,
                verified: verified,
                userState: user_state
            }
            
            authAction(payload)
            setLoading(false)
            userModalAction(false)
        })
    }

    return (
        <form onSubmit={onSubmit}>
            <Stack>
                <Stack direction={"column"} grow>
                    <TextInput
                        required
                        label="Email"
                        placeholder="example@gmail.com"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && 'Invalid email'}
                    />

                    <PasswordInput
                        required
                        label="Password"
                        placeholder="Your Password"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        error={form.errors.password && 'Password should include at least 6 characters'}
                    />
                </Stack>

                <Group position={"apart"} mt="xl">
                    <Anchor component="button" type="button" color={"gray"} onClick={HandleChangeClick} size={"xs"}>
                        Dont have an account? Register
                    </Anchor>

                    <Button type={"submit"}>Login</Button>
                </Group>
            </Stack>
        </form>
    )
}

const mapStateToProps = state => ({
    
})

const mapDispatchToProps = dispatch => ({
    authAction: (payload) => dispatch(authAction(payload)),
    userModalAction: (payload) => dispatch(userModalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
import React, { useState } from "react"

import { useForm } from "@mantine/hooks";

import {
    TextInput,
    PasswordInput,
    Group,
    Button,
    Checkbox,
    Anchor,
} from '@mantine/core';

import { connect } from "react-redux"
import { authAction } from "../../../../../data/actions/userActions"
import { showNotification } from '@mantine/notifications'

const SignupForm = ({ changeState }) => {
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            passwordConf: '',
            name: '',
            terms: false
        },

        validationRules: {
            email: (val) => /^\S+@\S+$/.test(val),
            password: (val) => val.length >= 6,
            passwordConf: (val) => val.length >= 6,
        }
    })

    function HandleChangeClick(e) {
        e.preventDefault()
        changeState(false)
    }

    function OnSubmit(e) {
        e.preventDefault()

        const email   = form.values.email
        const pwd     = form.values.password
        const pwdConf = form.values.passwordConf
        const name    = form.values.name
        const terms   = form.values.terms

        if(terms == false)
            showNotification({
                title: "Register Error",
                message: "You have to accept our terms and conditions",
                color: 'red',
                autoClose: 1000 * 10
            })
        if(pwd !== pwdConf)
            showNotification({
                title: "Register Error",
                message: "Your passwords do not match",
                color: 'red',
                autoClose: 1000 * 10
            })
    }

    return (
        <form onSubmit={OnSubmit}>
            <Group direction="column" grow>
                <TextInput
                    required
                    label="Username"
                    placeholder="Your Username"
                    value={form.values.name}
                    onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                />

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

                <PasswordInput
                    required
                    label="Password Confirmation"
                    placeholder="Your Password Again"
                    value={form.values.passwordConf}
                    onChange={(event) => form.setFieldValue('passwordConf', event.currentTarget.value)}
                    error={form.errors.password && 'Password should include at least 6 characters'}
                />

                <Checkbox
                    label={"I accept the terms and conditions"}
                    checked={form.values.terms}
                    onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                />
            </Group>

            <Group position={"apart"} mt="xl">
                <Anchor component="button" type="button" color={"gray"} onClick={HandleChangeClick} size={"xs"}>
                    Already have an account? Login
                </Anchor>

                <Button type={"submit"}>Register</Button>
            </Group>
        </form>
    )
}

const mapStateToProps = state => ({
    
})

const mapDispatchToProps = dispatch => ({
    authAction: (payload) => dispatch(authAction(payload))
})

export default SignupForm
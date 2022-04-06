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

const SignupForm = ({ changeState }) => {
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            name: '',
            terms: false
        },

        validationRules: {
            email: (val) => /^\S+@\S+$/.test(val),
            password: (val) => val.length >= 6,
        }
    })

    function HandleChangeClick(e) {
        e.preventDefault()
        changeState(false)
    }

    function OnSubmit(e) {
        e.preventDefault()
    }

    return (
        <form onSubmit={OnSubmit}>
            <Group direction="column" grow>
                <TextInput
                    required
                    label="Name"
                    placeholder="Your Name"
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

export default SignupForm
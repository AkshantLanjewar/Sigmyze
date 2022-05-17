import React, { useState } from "react"

import { useForm } from "@mantine/hooks";

import {
    TextInput,
    PasswordInput,
    Group,
    Button,
    Anchor,
} from '@mantine/core';

const LoginForm = ({ changeState }) => {
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
    }

    return (
        <form onSubmit={onSubmit}>
            <Group direction={"column"} grow>
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
            </Group>

            <Group position={"apart"} mt="xl">
                <Anchor component="button" type="button" color={"gray"} onClick={HandleChangeClick} size={"xs"}>
                    Dont have an account? Register
                </Anchor>

                <Button type={"submit"}>Login</Button>
            </Group>
        </form>
    )
}

export default LoginForm
import React, { useState } from "react"

import {
    Paper,
    Group,
    Button,
    Divider,
} from '@mantine/core';

import { AiFillFacebook, AiOutlineGoogle } from 'react-icons/ai'

import SignupForm from "./sub-components/signup-form"
import LoginForm  from "./sub-components/login-form"

import './auth-form.scss' 

const AuthForm = () => {
    const [formState, setFormState] = useState(false)

    return (
        <Paper radius={'md'} p={'xl'}>
            {/** 
            <Group grow mb="md" mt="md">
                <Button radius={"xl"} color={"indigo"} sx={{ fontSize: "1.25rem" }}> 
                    <AiFillFacebook /> 
                </Button>
                <Button radius={"xl"} color={"red"} sx={{ fontSize: "1.25rem" }}> 
                    <AiOutlineGoogle /> 
                </Button>
            </Group>

            <Divider label="Or continue with email" labelPosition="center" my={"lg"} />
            */}

            { formState
                ? <SignupForm changeState={setFormState} />
                : <LoginForm  changeState={setFormState} />
            }
        </Paper>
    )
}

export default AuthForm
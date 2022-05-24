import React, { useState } from "react"

import {
    Paper,
    LoadingOverlay
} from '@mantine/core';

import { AiFillFacebook, AiOutlineGoogle } from 'react-icons/ai'

import SignupForm from "./sub-components/signup-form"
import LoginForm  from "./sub-components/login-form"

import './auth-form.scss' 

const AuthForm = () => {
    const [formState, setFormState] = useState(false)
    const [loading, setLoading]     = useState(false)

    return (
        <Paper radius={'md'} p={'xl'} sx={{ position: "relative" }}>
            <LoadingOverlay 
                visible={loading} 
                loaderProps={{ variant: 'dots' }}
            />

            { formState
                ? <SignupForm changeState={setFormState} setLoading={setLoading} />
                : <LoginForm  changeState={setFormState} setLoading={setLoading} />
            }
        </Paper>
    )
}

export default AuthForm
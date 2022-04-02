import React, { useState } from "react"
import './auth-form.scoped.scss'

import Card from '../../basic/card/card'
import Group from "../../basic/group/group"
import Button from "../../basic/buttons/button"
import Divider from '../../basic/divider/divider'

import { AiFillFacebook, AiOutlineGoogle } from 'react-icons/ai'

import SignupForm from "./sub-components/signup-form"
import LoginForm  from "./sub-components/login-form"

const AuthForm = () => {
    const [formState, setFormState] = useState(false)

    return (
        <Card>
            <Group type={"column"} gapSize={"sm"} marginType={"sm"}>
                <Group>
                    <Button widthSize={"full"} padding={"md"} pColor={"blue"} rounding={"rounding-lg"}>
                        <Button.Icon><AiFillFacebook /></Button.Icon>
                        <Button.Text>
                            <Button.Text.Title>Facebook</Button.Text.Title>
                        </Button.Text>
                    </Button>

                    <Button widthSize={"full"} padding={"md"} pColor={"red"} rounding={"rounding-lg"}>
                        <Button.Icon><AiOutlineGoogle /></Button.Icon>
                        <Button.Text>
                            <Button.Text.Title>Google</Button.Text.Title>
                        </Button.Text>
                    </Button>
                </Group>

                <Divider label={"Or continue with"} />

                { formState ? <SignupForm changeState={setFormState} /> : <LoginForm changeState={setFormState} /> }
            </Group>
        </Card>
    )
}

export default AuthForm
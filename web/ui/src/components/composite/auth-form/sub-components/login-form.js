import React, { useState } from "react"
import Form    from '../../../basic/form/form'
import Group   from "../../../basic/group/group"
import Button  from "../../../basic/buttons/button"

import { MdAlternateEmail } from "react-icons/md"
import { RiLockPasswordFill } from 'react-icons/ri'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { BsPersonFill } from 'react-icons/bs'

const LoginForm = ({ changeState }) => {
    const [iconState, setIconState] = useState(false)

    function HandleIconClick() {
        setIconState(!iconState)
    }

    function HandleChangeClick(e) {
        e.preventDefault()
        changeState(true)
    }

    return (
        <Form>
            <Group type={"column"} marginType={"sm"}>
                <Form.Element>
                    <Group marginType={"sm"}>
                        <Form.Element.Label>E-Mail <span style={{ color: 'red' }}>*</span> </Form.Element.Label>
                    </Group>

                    <Form.Element.TextInput type={"email"} radius={"sm"}>
                        <Form.Element.TextInput.Icon>
                            <MdAlternateEmail />
                        </Form.Element.TextInput.Icon>
                    </Form.Element.TextInput>
                </Form.Element>

                <Form.Element>
                    <Group marginType={"sm"}>
                        <Form.Element.Label>Password <span style={{ color: 'red' }}>*</span> </Form.Element.Label>
                    </Group>

                    <Form.Element.TextInput type={iconState ? "text" : "password"} radius={"sm"}>
                        <Form.Element.TextInput.Icon>
                            <RiLockPasswordFill />
                        </Form.Element.TextInput.Icon>

                        <Form.Element.TextInput.RightButton sxOnClick={HandleIconClick}>
                            {iconState ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </Form.Element.TextInput.RightButton>
                    </Form.Element.TextInput>
                </Form.Element>

                <Group marginType={"md"}>
                    <button
                        onClick={HandleChangeClick}
                        className="auth-flavor">
                        Dont have an account? Register
                    </button>

                    <Button grow={false} pColor={"blue"}>
                        <Button.Text>
                            <Button.Text.Title>Login</Button.Text.Title>
                        </Button.Text>
                    </Button>
                </Group>
            </Group>
        </Form>
    )
}

export default LoginForm
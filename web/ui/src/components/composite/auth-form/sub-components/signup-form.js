import React, { useState } from "react"
import Form    from '../../../basic/form/form'
import Group   from "../../../basic/group/group"
import Button  from "../../../basic/buttons/button"

import { MdAlternateEmail } from "react-icons/md"
import { RiLockPasswordFill } from 'react-icons/ri'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { BsPersonFill } from 'react-icons/bs'

const SignupForm = ({ changeState }) => {
    function HandleChangeClick(e) {
        e.preventDefault()
        changeState(false)
    }

    const [iconPWD, setIconPWD]         = useState(false)
    const [iconPWDConf, setIconPWDConf] = useState(false)

    return (
        <Form>
            <Group type={"column"} marginType={"sm"}>
                <Form.Element>
                    <Group marginType={"sm"}>
                        <Form.Element.Label>Name <span style={{ color: 'red' }}>*</span> </Form.Element.Label>
                    </Group>

                    <Form.Element.TextInput type={"text"} radius={"sm"}>
                        <Form.Element.TextInput.Icon>
                            <BsPersonFill />
                        </Form.Element.TextInput.Icon>
                    </Form.Element.TextInput>
                </Form.Element>

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

                    <Form.Element.TextInput type={iconPWD ? "text" : "password"} radius={"sm"}>
                        <Form.Element.TextInput.Icon>
                            <RiLockPasswordFill />
                        </Form.Element.TextInput.Icon>

                        <Form.Element.TextInput.RightButton sxOnClick={() => { setIconPWD(!iconPWD) }}>
                            {iconPWD ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </Form.Element.TextInput.RightButton>
                    </Form.Element.TextInput>
                </Form.Element>

                <Form.Element>
                    <Group marginType={"sm"}>
                        <Form.Element.Label>Password Conf <span style={{ color: 'red' }}>*</span> </Form.Element.Label>
                    </Group>

                    <Form.Element.TextInput type={iconPWDConf ? "text" : "password"} radius={"sm"}>
                        <Form.Element.TextInput.Icon>
                            <RiLockPasswordFill />
                        </Form.Element.TextInput.Icon>

                        <Form.Element.TextInput.RightButton sxOnClick={() => { setIconPWDConf(!iconPWDConf) }}>
                            {iconPWDConf ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </Form.Element.TextInput.RightButton>
                    </Form.Element.TextInput>
                </Form.Element>

                <Form.Element>
                    <Form.Element.CheckBoxInput labelVal={"I agree to Terms and Conditions"}></Form.Element.CheckBoxInput>
                </Form.Element>

                <Group marginType={"md"}>
                    <button
                        onClick={HandleChangeClick}
                        className="auth-flavor">
                        Have an account already? Login
                    </button>

                    <Button grow={false} pColor={"blue"}>
                        <Button.Text>
                            <Button.Text.Title>Signup</Button.Text.Title>
                        </Button.Text>
                    </Button>
                </Group>
            </Group>
        </Form>
    )
}

export default SignupForm
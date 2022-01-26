import React, { useEffect, useState } from "react"

import LoginForm from './login-form'
import SignupLayout from './signup-layout'

import { FaFacebookF, FaGoogle } from "react-icons/fa"

function LoginLayout(props) {
    let setAuthState = props.setAuthState
    let setMessages  = props.setMessages

    return (
        <div className='user-auth'>
            <LoginForm setMessages={setMessages} />

            <div className="social-media">
                <div className="text">Or</div>

                <div className="medias">
                    <button className="media google" onClick={() => { window.location = "/user/google" }}>
                        <FaGoogle />
                    </button>

                    <button className="media google" onClick={() => { window.location = "/user/fb" }}>
                        <FaFacebookF />
                    </button>
                </div>
            </div>

            <div className="option">
                Not a member?
                <span className="alt-flare" onClick={() => { setAuthState("signup") }}> Signup</span> now
            </div>

            <div className="option" style={{paddingTop: "1em"}}>
                Forgot your password?
                <span className="alt-flare" onClick={() => { setAuthState("forgot") }}> Recover it</span>
            </div>
        </div>
    )
}

function ForgotPWD(props) {
    const setAuthState = props.setAuthState
    const setMessages  = props.setMessages
    const [formState, setFormState] = useState(false)

    return (
        <div>
            {formState
                ? (
                    <form>
                        
                    </form>
                )
                : (
                    <form>

                    </form>
                )
            }
        </div>
    )
}


function UserAuth(props) {
    const [authState, setAuthState] = useState("login")
    let setUserTitle = props.setUserTitle
    let setMessages  = props.setMessages

    useEffect(() => {
        if(authState == "signup")
            setUserTitle("Signup")
        if(authState == "login")
            setUserTitle("Login")
        if(authState == "forgot")
            setUserTitle("Recover account password")
    }, [authState])

    if(authState == "login")
        return (<LoginLayout setAuthState={setAuthState} setMessages={setMessages} />)
    if(authState == "signup")
        return (<SignupLayout setAuthState={setAuthState} setMessages={setMessages} />)
    if(authState == "forgot")
        return (<ForgotPWD setAuthState={setAuthState} setMessages={setMessages} />)
}

export default UserAuth
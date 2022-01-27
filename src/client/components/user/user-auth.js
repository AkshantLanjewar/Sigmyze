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
    const [formState, setFormState] = useState("email")

    const emailRef = React.createRef()
    const codeRef  = React.createRef()
    const pwdRef   = React.createRef()

    function OnEmailSubmit(e) {
        e.preventDefault()
    }

    function OnCodeSubmit(e) {
        e.preventDefault()
    }

    function OnNewPWDSubmit(e) {
        e.preventDefault()
    }

    let val = ( <form></form> )

    if(formState == "email")
        val =  (
            <form onSubmit={OnEmailSubmit}>
                <div className="input-box">
                    <input type='email' placeholder='Enter your E-Mail' ref={emailRef} required />
                    <div className="underline"></div>
                </div>

                <div className='input-box btn'>
                    <input type='submit' name="" value={"Send"} />
                </div>
            </form>
        )
    if(formState == "code")
            val = (
                <form onSubmit={OnCodeSubmit}>
                    <div className="input-box">
                        <input type='text' placeholder='Enter the code' ref={codeRef} required />
                        <div className="underline"></div>
                    </div>

                    <div className='input-box btn'>
                        <input type='submit' name="" value={"Verify"} />
                    </div>
                </form>
            )
    if(formState == "code")
            val = (
                <form onSubmit={OnNewPWDSubmit}>
                    <div className="input-box">
                        <input type='password' placeholder='Set new password' ref={pwdRef} required />
                        <div className="underline"></div>
                    </div>

                    <div className='input-box btn'>
                        <input type='submit' name="" value={"Set"} />
                    </div>
                </form>
            )

    return (
        <div className="user-auth">
            {val}

            <div className="option" style={{paddingTop: "2em"}}>
                Go back to
                <span className="alt-flare" onClick={() => { setAuthState("login") }}> Login</span>
            </div>
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
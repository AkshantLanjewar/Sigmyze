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
                <span className="alt-flare" onClick={() => { setAuthState(true) }}> Signup</span> now
            </div>
        </div>
    )
}


function UserAuth(props) {
    const [authState, setAuthState] = useState(false)
    let setUserTitle = props.setUserTitle
    let setMessages  = props.setMessages

    useEffect(() => {
        if(authState == true)
            setUserTitle("Signup")
        if(authState == false)
            setUserTitle("Login")
    }, [authState])

    return (
        <div>
            {authState ? <SignupLayout setAuthState={setAuthState} setMessages={setMessages} /> : <LoginLayout setAuthState={setAuthState} setMessages={setMessages} />}
        </div>
    )
}

export default UserAuth
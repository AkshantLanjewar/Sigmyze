import React, { useEffect, useState } from "react"
import SignupLayout from './signup-layout'

import { FaFacebookF, FaGoogle } from "react-icons/fa"

function LoginLayout(props) {
    let setAuthState = props.setAuthState

    return (
        <div className='user-auth'>
            <form>
                <div className='input-box'>
                    <input type='text' placeholder='Enter your E-Mail' required />
                    <div className="underline"></div>
                </div>

                <div className='input-box'>
                    <input type='password' placeholder='Enter your Password' required />
                    <div className="underline"></div>
                </div>

                <div className='input-box btn'>
                    <input type='submit' name="" value={"Login"} />
                </div>
            </form>

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
            {authState ? <SignupLayout setAuthState={setAuthState} setMessages={setMessages} /> : <LoginLayout setAuthState={setAuthState} />}
        </div>
    )
}

export default UserAuth
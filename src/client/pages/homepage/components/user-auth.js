import React, { useEffect, useState } from "react"

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

                    <button className="media fb" onClick={() => { window.location = "/user/fb" }}>
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

function SignupLayout(props) {
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
                <div className='input-box'>
                    <input type='password' placeholder='Password Confirmation' required />
                    <div className="underline"></div>
                </div>

                <div className="input-box check">
                    <input type='checkbox' name="toc" />
                    <div className="label">By Clicking you agree to our Terms and Conditions</div>
                </div>

                <div className='input-box btn'>
                    <input type='submit' name="" value={"Signup"} />
                </div>
            </form>

            <div className="option" style={{marginTop: "2em"}}>
                Have an account?
                <span className="alt-flare" onClick={() => { setAuthState(false) }}> Login</span>
            </div>
        </div>
    )
}

function UserAuth(props) {
    const [authState, setAuthState] = useState(false)
    let setUserTitle = props.setUserTitle

    useEffect(() => {
        if(authState == true)
            setUserTitle("Signup")
        if(authState == false)
            setUserTitle("Login")
    }, [authState])

    return (
        <div>
            {authState ? <SignupLayout setAuthState={setAuthState} /> : <LoginLayout setAuthState={setAuthState} />}
        </div>
    )
}

export default UserAuth
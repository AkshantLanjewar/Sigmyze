import React from "react"

function StepOne() {
    return (
        <form>
            <div className="input-box">
                <input type='text' placeholder='Enter your E-Mail' required />
                <div className="underline"></div>
            </div>

            <div className='input-box btn'>
                <input name="" value={"Next"} />
            </div>
        </form>
    )
}

function StepTwo() {
    return (
        <form>
            <div className='input-box'>
                <input type='text' placeholder='Enter your Firstname' required />
                <div className="underline"></div>
            </div>

            <div className='input-box'>
                <input type='text' placeholder='Enter your Lastname' required />
                <div className="underline"></div>
            </div>

            <div className='input-box btn'>
                <input name="" value={"Next"} />
            </div>
        </form>
    )
}

function SignupLayout(props) {
    let setAuthState = props.setAuthState

    return (
        <div className='user-auth'>
            <form>

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
import React, { useState, useEffect } from "react"

function StepOne(props) {
    const changeStep  = props.changeStep
    const setMessages = props.setMessages
    const formData    = props.formData
    const setFormData = props.setFormData

    const emailRef     = React.createRef()
    const firstnameRef = React.createRef()
    const lastnameRef  = React.createRef()

    const [tFormData, setTFormData] = useState({ email: formData.email, firstname: formData.firstname, lastname: formData.lastname })

    useEffect(() => {
        setTFormData({ email: props.formData.email, firstname: props.formData.firstname, lastname: props.formData.lastname })
    }, [props.formData])

    function Next(e) {
        e.preventDefault()
        let emailVal     = emailRef.current.value
        let firstnameVal = firstnameRef.current.value
        let lastnameVal  = lastnameRef.current.value
        
        let flag = false
        let msgs = []

        if(emailVal.length == 0) {
            msgs.push("Please enter your Email")
            flag = true
        }

        if(firstnameVal.length == 0) {
            msgs.push("Please enter your Firstname")
            flag = true
        }

        if(lastnameVal.length == 0) {
            msgs.push("Please enter your Lastname")
            flag = true
        }

        if(flag == false) {
            setFormData({ email: emailVal, firstname: firstnameVal, lastname: lastnameVal, password: props.formData.password })
            changeStep(true)
        }

        if(flag) {
            let messages = []
            for(let i = 0; i < msgs.length; i++)
                messages.push({ subject: "User Authentication", message: msgs[i] })
            setMessages(messages)

            let time = 0
            for(let i = 0; i < messages.length; i++) {
                time += 1000

                setTimeout(() => {
                    messages.shift()
                    setMessages([...messages])
                }, time)
            }
        }
    }

    function onInputchange(name, event) {
        let tmpData = tFormData
        tmpData[name] = event.target.value
        setTFormData({ ...tmpData })
    }

    return (
        <form>
            <div className="input-box">
                <input type='text'placeholder='Enter your E-Mail' value={tFormData.email} ref={emailRef} onChange={(e) => { onInputchange("email", e) }} />
                <div className="underline"></div>
            </div>

            <div className='input-box'>
                <input type='text' onChange={(e) => { onInputchange("firstname", e) }}  placeholder='Enter your Firstname' value={tFormData.firstname} ref={firstnameRef} />
                <div className="underline"></div>
            </div>
            <div className='input-box'>
                <input type='text' onChange={(e) => { onInputchange("lastname", e) }}  placeholder='Enter your Lastname' value={tFormData.lastname} ref={lastnameRef} />
                <div className="underline"></div>
            </div>

            <div className='input-box btn'>
                <button style={{ marginLeft: "auto" }} onClick={Next}>Next</button>
            </div>
        </form>
    )
}


function StepTwo(props) {
    const changeStep  = props.changeStep
    const setMessages = props.setMessages

    const passwordRef     = React.createRef()
    const passwordConfRef = React.createRef()
    const tosRef          = React.createRef()

    function Prev(e) {
        e.preventDefault()
        changeStep(false)
    }

    function Submit(e) {
        e.preventDefault()
        let passwordVal     = passwordRef.current.value
        let passwordConfVal = passwordConfRef.current.value 
        let tosVal          = tosRef.current
        let flag = false
        let msgs = []

        if(passwordVal.length == 0) {
            flag = true
            msgs.push("Please enter your password")
        }

        if(passwordConfVal.length == 0) {
            flag = true
            msgs.push("Please enter your password again")
        }

        if(passwordVal !== passwordConfVal) {
            flag = true
            msgs.push("Your passwords do not match")
        }

        if(!tosVal.checked) {
            flag = true
            msgs.push("You have to accept our terms of service")
        }

        if(flag) {
            let messages = []
            for(let i = 0; i < msgs.length; i++)
                messages.push({ subject: "User Authentication", message: msgs[i] })
            setMessages(messages)

            let time = 0
            for(let i = 0; i < messages.length; i++) {
                time += 1000

                setTimeout(() => {
                    messages.shift()
                    setMessages([...messages])
                }, time)
            }
        }

        if(!flag) {
            //handle submit logic
            const formData       = props.formData
            formData['password'] = passwordVal 

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            }

            fetch('/user/signup', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if(data.error) {
                        let messages = []
                        if(data.message == 'exists')
                            messages.push({ subject: "User Authentication", message: "User already exists" })

                        setMessages(messages)
                        setTimeout(() => { setMessages([]) }, 1000)
                        return
                    }

                    window.location.reload()
                })
        }
    }

    return (
        <form>
            <div className='input-box'>
                <input type='password' placeholder='Enter your Password' ref={passwordRef} required />
                <div className="underline"></div>
            </div>
            <div className='input-box'>
                <input type='password' placeholder='Password Confirmation' ref={passwordConfRef} required />
                <div className="underline"></div>
            </div>

            <div className="input-box check">
                <input type='checkbox' name="toc" ref={tosRef} required />
                <div className="label">By Clicking you agree to our Terms and Conditions</div>
            </div>

            <div className='input-box btn'>
                <button onClick={Prev}>Prev</button>
                <button onClick={Submit}>Submit</button>
            </div>
        </form>
    )
}

function SignupLayout(props) {
    let setAuthState = props.setAuthState
    let setMessages  = props.setMessages
    const [formState, setFormState] = useState(false)
    const [formData, setFormData] = useState({ email: null, firstname: null, lastname: null, password: null })

    return (
        <div className='user-auth'>
            { formState 
                ? <StepTwo changeStep={setFormState} setMessages={setMessages} formData={formData} setFormData={setFormData} /> 
                : <StepOne changeStep={setFormState} setMessages={setMessages} formData={formData} setFormData={setFormData} /> 
            }

            <div className="option" style={{marginTop: "2em"}}>
                Have an account?
                <span className="alt-flare" onClick={() => { setAuthState(false) }}> Login</span>
            </div>
        </div>
    )
}

export default SignupLayout
import React from "react"

function LoginForm(props) {
    const emailRef    = React.createRef()
    const passwordRef = React.createRef()
    const setMessages = props.setMessages

    function Login(event) {
        event.preventDefault()
        let emailValue    = emailRef.current.value
        let passwordValue = passwordRef.current.value
        let flag = false
        let msgs = []

        if(!flag) {
            let formData = { email: emailValue, password: passwordValue }
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            }

            fetch('/user/login', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if(data.error) {
                        let messages = []

                        if(data.message == 'dn_exists')
                            messages.push({ subject: "User Authentication", message: "User does not exist" })
                        if(data.message == 'bad_pw')
                            messages.push({ subject: "User Authentication", message: "Password does not match with our database" })
                        
                        setMessages(messages)
                        setTimeout(() => { setMessages([]) }, 1000)
                        return
                    }

                    window.location.reload()
                })
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

    return (
        <form onSubmit={Login}>
            <div className='input-box'>
                <input type='text' placeholder='Enter your E-Mail' ref={emailRef} required />
                <div className="underline"></div>
            </div>

            <div className='input-box'>
                <input type='password' placeholder='Enter your Password' ref={passwordRef} required />
                <div className="underline"></div>
            </div>

            <div className='input-box btn'>
                <input type='submit' name="" value={"Login"} />
            </div>
        </form>
    )
}

export default LoginForm
import React from "react"

function UserVerify(props) {
    const verificationRef = React.createRef()
    const setMessages     = props.setMessages

    function Signout(e) {
        e.preventDefault()

        let url = '/user/logout'
        fetch(url)
            .then(response => response.json())
            .then(data => {
                window.location.reload()
            })
    }

    function Verify(e) {
        e.preventDefault()
        const verificationValue = verificationRef.current.value

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ver_code: verificationValue })
        }
        fetch('/user/verify', requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.error) {
                    if(data.message == "bad_code")
                        setMessages([{ subject: "User Authentication", message: "Code does not match" }])

                    setTimeout(() => { setMessages([]) }, 1000)
                    return
                }

                window.location.reload()
            })
    }

    return (
        <div className="user-auth">
            <form onSubmit={Verify}>
                <div className='input-box'>
                    <input type='text' placeholder='Enter your verification code' ref={verificationRef} required />
                    <div className="underline"></div>
                </div>

                <div className='input-box btn'>
                    <input type='submit' name="" value={"Verify"} />
                </div>
            </form>

            <div className="option" style={{ marginTop: "2em" }}>
                Alternatively
                <span className="alt-flare" onClick={Signout}> Logout</span>
            </div>
        </div>
    )
}

export default UserVerify
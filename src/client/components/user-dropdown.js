import React, { useState, useEffect } from "react"
import { IoIosExit } from "react-icons/io"

function UserDropdown(props) {
    function Signout() {
        let url = '/user/logout'
        fetch(url)
            .then(response => response.json())
            .then(data => {
                window.location.reload()
            })
    }

    const [imageLoaded] = useState(true)

    useEffect(() => {
        let url = '/user/profile'
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
    })
    
    return (
        <div style={{marginLeft: "1em"}}>
            <div className='user-control'>
                <button className='profile'>
                    {imageLoaded
                        ? <img src="https://lh3.googleusercontent.com/a-/AOh14Gg57h_9fOyReouOqgOfbuiiSlVpX-3PZzECn2Xf=s96-c" />
                        : <div className="word">A</div>
                    }
                </button>

                <div className="dropdown">
                    <div className="header">
                        <div className="profile-image">
                            {imageLoaded
                                ? <img src="https://lh3.googleusercontent.com/a-/AOh14Gg57h_9fOyReouOqgOfbuiiSlVpX-3PZzECn2Xf=s96-c" />
                                : <div className="word">A</div>
                            }
                        </div>

                        <div className="name-container">
                            <div className="name">Akshant Lanjewar</div>

                            <a className="options">Manage your account</a>
                        </div>
                    </div>

                    <div className="account-actions">
                        <a className="action" onClick={Signout}>
                            <IoIosExit />

                            <span>Signout</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDropdown
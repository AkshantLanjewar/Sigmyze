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

    const [imageLoaded, setImageLoaded] = useState(true)
    const [image, setImage] = useState('')
    const [profileName, setProfileName] = useState({ firstname: "", lastname: "", firstInital: "" })

    useEffect(() => {
        let url = '/user/profile'
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if(data['action'] == "unlog")
                    Signout()
                if(data['image'] == null)
                    setImageLoaded(false)
                setProfileName({ firstname: data['firstname'], lastname: data['lastname'], firstInital: data['firstname'].charAt(0).toUpperCase() })
                setImage(data['image'])
            })
    }, [])
    
    return (
        <div style={{marginLeft: "1em"}}>
            <div className='user-control'>
                <button className='profile'>
                    {imageLoaded
                        ? <img src={image} />
                        : <div className="word">{profileName.firstInital}</div>
                    }
                </button>

                <div className="dropdown">
                    <div className="header">
                        <div className="profile-image">
                            {imageLoaded
                                ? <img src={image} />
                                : <div className="word">{profileName.firstInital}</div>
                            }
                        </div>

                        <div className="name-container">
                            <div className="name">{profileName.firstname} {profileName.lastname}</div>

                            <a className="options">Manage your account</a>
                        </div>
                    </div>

                    <div className="actions">
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
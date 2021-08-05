import React from "react"
import '../sass/login-form.scss'

import { AiFillGoogleCircle, AiOutlineGithub } from 'react-icons/ai'
import { FiX } from 'react-icons/fi'

const ICON_DICT: Record<string, any> = {
    "Google": <AiFillGoogleCircle />,
    "GitHub": <AiOutlineGithub />
}

type SocialContainerProps = {
    social: string
}

const SocialContainer: React.FC<SocialContainerProps> = ({children, social}) => {
    return (
        <button className="social">
            <span className="social-wrap">
                <a className="social-container" href="/user/auth/google">
                    {ICON_DICT[social]}
                    <span>Login with {social}</span>
                </a>
            </span>
        </button>
    )
}

type LoginformProps = {
    closeModal: Function
}

const Loginform: React.FC<LoginformProps> = ({children, closeModal}) => {
    return (
        <div className="login-form">
            <div className="disclaimer-container">
                <div className="header">
                    <h3 className="login-title">Welcome</h3>
                    <FiX onClick={() => { closeModal() }} />
                </div>
                <p className="notice">By logging in you accept our <span className="term">Terms of Service</span></p>
            </div>

            <div className="social-container">
                <SocialContainer social={"Google"} />
            </div>
        </div>
    )
}

export default Loginform
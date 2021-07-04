import './login.scss'

import { AiFillGoogleCircle, AiOutlineGithub } from 'react-icons/ai'
import { FiX } from 'react-icons/fi'

const ICON_DICT = {
    "Google": <AiFillGoogleCircle />,
    "GitHub": <AiOutlineGithub />
}

function SocialContainer(props) {
    return (
        <button className="social">
            <span className="social-wrap">
                <div className="social-container">
                    {ICON_DICT[props.social]}
                    <span>Login with {props.social}</span>
                </div>
            </span>
        </button>
    )
}

function LoginForm(props) {
    return (
        <div className="login-form">
            <div className="disclaimer-container">
                <div className="header">
                    <h3 className="login-title">Welcome</h3>
                    <FiX onClick={props.closeModal} />
                </div>
                <p className="notice">By logging in you accept our <span className="term">Terms of Service</span></p>
            </div>

            <div className="social-container">
                <SocialContainer social={"GitHub"} />
                <SocialContainer social={"Google"} />
            </div>
        </div>
    )
}

export default LoginForm
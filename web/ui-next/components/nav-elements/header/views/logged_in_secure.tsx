import Logo from "../../logo/logo"
import UserDropdown from "../user-dropdown/user-dropdown"

/**
 * @description
 *  this is the navbar when logged in,
 *  on secure pages
 * @returns Logged In Secure Components
 */
const LoggedInSecure: React.FC = ({ }) => {
    return (
        <>
            <Logo />
            <UserDropdown />
        </>
    )
}

export default LoggedInSecure
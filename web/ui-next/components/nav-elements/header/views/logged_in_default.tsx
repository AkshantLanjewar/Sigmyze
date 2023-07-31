import Logo from "../../logo/logo"
import UserDropdown from "../user-dropdown/user-dropdown"
import MenuItems from "./menu_items"

/**
 * @description
 *  this is the layout for when the user is logged in,
 *  but at a non protected page
 * @returns LoggedInDefault navbar veiw
 */
const LoggedInDefault: React.FC = ({ }) => {
    return (
        <>
            <Logo />
            <MenuItems />
            <UserDropdown />
        </>
    )
}

export default LoggedInDefault
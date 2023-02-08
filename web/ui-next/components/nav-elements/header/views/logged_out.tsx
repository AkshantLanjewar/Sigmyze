import Logo from "../../logo/logo"
import MenuItems from "./menu_items"
import styles from '../header.module.scss'
import { Button } from "@mantine/core"

/**
 * @description
 *  this is the navbar view for when the user is logged out
 * @returns Logged Out Navbar Components
 */
const LoggedOutView: React.FC = ({ }) => {
    return (
        <>
            <Logo />
            <MenuItems />

            <div className={styles.authControls}>
                <Button
                    variant={"subtle"}
                    color={"gray"}
                    radius={"xl"}
                >
                    Login
                </Button>

                <Button
                    variant={"filled"}
                    color={"indigo"}
                    radius={"xl"}
                >
                    Register
                </Button>
            </div>
        </>
    )
}

export default LoggedOutView
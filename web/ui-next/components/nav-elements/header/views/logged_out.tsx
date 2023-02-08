import Logo from "../../logo/logo"
import MenuItems from "./menu_items"
import styles from '../header.module.scss'
import { Button } from "@mantine/core"
import Link from 'next/link'

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
                <Link href={"/auth/login"}>
                    <Button
                        variant={"subtle"}
                        color={"gray"}
                        radius={"xl"}
                    >
                        Login
                    </Button>
                </Link>

                <Link href={"/auth/register"}>
                    <Button
                        variant={"filled"}
                        color={"indigo"}
                        radius={"xl"}
                    >
                        Register
                    </Button>
                </Link>
            </div>
        </>
    )
}

export default LoggedOutView
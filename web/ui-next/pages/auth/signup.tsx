import { MantineProvider } from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"
import UserContext from "../../components/data/user/context"
import { theme } from "../../components/default-theme"
import styles from '../../components/pages/auth/auth-styles.module.scss'
import SignupPageComponent from "../../components/pages/auth/signup-page"

const Signup: React.FC = ({ }) => {    
    return (
        <div className={styles.wrapper}>
            
            <MantineProvider 
                withGlobalStyles
                withNormalizeCSS
                withCSSVariables 
                theme={theme}
            >
                <NotificationsProvider>
                    <UserContext>
                        <div className={styles.wrapper}>
                            <SignupPageComponent />
                        </div>
                    </UserContext>
                </NotificationsProvider>
            </MantineProvider>
        </div>
    )
}

export default Signup
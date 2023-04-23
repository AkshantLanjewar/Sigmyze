import styles from '../../components/pages/auth/auth-styles.module.scss'
import { useForm } from '@mantine/form'
import { MantineProvider } from '@mantine/core'
import { theme } from '../../components/default-theme'
import { FormEvent } from 'react'
import LoginPageComponent from '../../components/pages/auth/login-page'
import UserContext from '../../components/data/user/context'
import { NotificationsProvider } from '@mantine/notifications'

/**
 * @description
 *  this is the login form for the website
 */
const LoginPage: React.FC = ({ }) => {
    const form = useForm({
        initialValues: {
            email: '',
            password: ''
        },

        validate: {
            email: (val) => /^\S+@\S+$/.test(val) ? "Please enter a valid email" : null,
        }
    })

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
    }
    
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
                            <LoginPageComponent />
                        </div>
                    </UserContext>
                </NotificationsProvider>
            </MantineProvider>
        </div>
    )
}

export default LoginPage
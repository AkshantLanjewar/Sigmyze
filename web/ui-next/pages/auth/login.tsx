import Logo from '../../components/nav-elements/logo/logo'
import Link from 'next/link'
import styles from './auth-styles.module.scss'
import chartEditorScreenshot from '../../public/screenshots/chart-editor.png'
import { useForm } from '@mantine/form'
import { Button, MantineProvider, PasswordInput, TextInput } from '@mantine/core'
import { theme } from '../../components/default-theme'
import { FormEvent } from 'react'

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
                <div className={styles.panel}>
                    <Logo />

                    <div className={styles.subtext}>
                        <div className={styles.focus}>Analyze Everything</div>
                        <div className={styles.shadow}>Check out our new document and chart editors</div>
                    </div>

                    <div className={styles.screenshotChart}></div>
                </div>

                <div className={styles.content}>
                    <div className={styles.loginWrapper}>
                        <div className={styles.title}>Welcome Back!</div>

                        <form className={styles.form} onSubmit={onSubmit}>
                            <TextInput 
                                required
                                withAsterisk
                                label={"E-Mail"}
                                size={"md"}
                                variant={"filled"}
                                placeholder={"example@gmail.com"}
                                {...form.getInputProps('email')}
                            />

                            <PasswordInput 
                                required
                                withAsterisk
                                placeholder={"Your Password"}
                                label={"Password"}
                                size={"md"}
                                variant={"filled"}
                                {...form.getInputProps('password')}
                            />

                            <Button
                                type={'submit'}
                                size={'md'}
                                mt={20}
                                radius={"xl"}
                            >
                                Login
                            </Button>
                        </form>
                    </div>

                    <div className={styles.actionText}>
                        Don't have an account?{' '}
                        
                        <Link href={"/auth/signup"}>
                            <span className={styles.link}>
                                Sign Up
                            </span>
                        </Link>
                    </div>

                    <Link href={"/"}>
                        <div className={styles.actionText}>
                            <span className={styles.link}>
                                Back Home
                            </span>
                        </div>
                    </Link>
                </div>
            </MantineProvider>
        </div>
    )
}

export default LoginPage
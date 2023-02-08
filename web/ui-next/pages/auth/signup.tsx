import { Button, Checkbox, MantineProvider, PasswordInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import Link from "next/link"
import { FormEvent } from "react"
import { theme } from "../../components/default-theme"
import Logo from "../../components/nav-elements/logo/logo"
import styles from './auth-styles.module.scss'

const Signup: React.FC = ({ }) => {
    const form = useForm({
        initialValues: {
            email: '',
            username: '',
            password: '',
            passwordConf: '',
            terms: false
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
                        <div className={styles.focus}>Built to Save Time</div>
                        <div className={styles.shadow}>
                            Create an Account and start discovering insights that make a difference.
                        </div>
                    </div>

                    <div className={`${styles.screenshot} ${styles.document}`}></div>
                </div>

                <div className={styles.content}>
                    <div className={styles.loginWrapper}>
                        <div className={styles.title}>Get Started!</div>

                        <form className={styles.form} onSubmit={onSubmit}>
                            <input type="text" style={{ display: "none" }} />
                            <input type="password" style={{ display: "none" }} />

                            <TextInput 
                                required
                                withAsterisk
                                label={"Username"}
                                size={"md"}
                                variant={"filled"}
                                type={"text"}
                                placeholder={"Your Username"}
                                styles={{ input: { height: 40 } }}
                                {...form.getInputProps('username')}
                            />

                            <TextInput 
                                required
                                withAsterisk
                                label={"E-Mail"}
                                size={"md"}
                                variant={"filled"}
                                type={"email"}
                                placeholder={"example@gmail.com"}
                                styles={{ input: { height: 40 } }}
                                {...form.getInputProps('email')}
                            />

                            <PasswordInput 
                                required
                                withAsterisk
                                placeholder={"Your Password"}
                                label={"Password"}
                                size={"md"}
                                variant={"filled"}
                                styles={{ input: { height: 40 } }}
                                {...form.getInputProps('password')}
                            />

                            <PasswordInput 
                                required
                                withAsterisk
                                placeholder={"Password Confirmation"}
                                label={"Your Password Again"}
                                size={"md"}
                                variant={"filled"}
                                styles={{ input: { height: 40 } }}
                                {...form.getInputProps('passwordConf')}
                            />

                            <Checkbox
                                required
                                style={{ display: "flex", alignItems: "center" }}
                                label={"I accept the Terms of Service (TOS)"}
                                {...form.getInputProps('terms')}
                            />

                            <Button
                                type={'submit'}
                                size={'md'}
                                mt={20}
                                radius={"xl"}
                            >
                                Sign up
                            </Button>
                        </form>
                    </div>

                    <div className={styles.actionText}>
                        Already have an account?{' '}
                        
                        <Link href={"/auth/login"}>
                            <span className={styles.link}>
                                Log in
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

export default Signup
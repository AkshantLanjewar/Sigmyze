import { TextInput, PasswordInput, Checkbox, Button } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import Link from "next/link"
import { useRouter } from "next/router"
import { FormEvent, useContext, useEffect, useState } from "react"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import Logo from "../../nav-elements/logo/logo"
import styles from './auth-styles.module.scss'
import { LoadingOverlay } from "@mantine/core"

const SignupPageComponent: React.FC = ({ }) => {
    const[visible, setVisible] = useState(false);

    const form = useForm({
        initialValues: {
            email: '',
            username: '',
            password: '',
            passwordConf: '',
            terms: false
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        }
    })

    const userContext = useContext(UserContextData) as IUserContext
    const router = useRouter()

    function errorMessage(msg: string) {
        showNotification({
            title: "Register Error",
            message: msg,
            color: 'red',
            autoClose: 1000 * 10
        })
    }

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        async function main() {
            setVisible(true);
            if(userContext.register === undefined) {
                setVisible(false);
                return
            }    

            let email = form.values.email
            let username = form.values.username 
            let password = form.values.password
            let passwordConf = form.values.passwordConf 
            let terms = form.values.terms

            if(username.length === 0) {
                setVisible(false);
                errorMessage("It seems you forgot to type in a Username")
                return
            }

            if(password.length < 7) {
                setVisible(false);
                errorMessage("Please type in a longer password")
                return
            }

            if(password !== passwordConf) {
                setVisible(false);
                errorMessage("Please make sure the passwords you typed match")
                return
            }

            if(terms === false) {
                setVisible(false);
                errorMessage("You must accept the terms")
                return
            }

            await userContext.register(email, username, password)
            setVisible(false);
            router.push('/auth/verify')
        }

        main()
    }

    useEffect(() => {
        if(userContext.loggedIn === true)
            router.push('/drive')
    }, [userContext.loggedIn])
    
    return (
        <>
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
                    <LoadingOverlay visible={visible} loaderProps={{ size: 'sm', color: 'blue', variant: 'oval' }} overlayOpacity={0.3} overlayColor="#c5c5c5"/>
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
        </>
    )
}

export default SignupPageComponent
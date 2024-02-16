import { TextInput, Button } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import Link from "next/link"
import { useRouter } from "next/router"
import { FormEvent, useCallback, useContext, useEffect, useState } from "react"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import { UserResendVerification } from "../../data/user/user-api"
import Logo from "../../nav-elements/logo/logo"
import styles from './auth-styles.module.scss'
import { LoadingOverlay } from "@mantine/core"

const VerifyPageComponent: React.FC = ({ }) => {
    const [visible, setVisible] = useState(false);

    const form = useForm({
        initialValues: {
            token: '',
        },
    })

    const { loaded, loggedIn, verified, authData, verify, logout } = useContext(UserContextData) as IUserContext
    const router = useRouter()

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        setVisible(true);
        e.preventDefault()

        async function main() {
            if(verify === undefined) {
                setVisible(false);
                return
            }
            if(authData?.token === undefined) {
                setVisible(false);
                return
            }

            let code = form.values.token
            await verify(authData.token, code)
            setVisible(false);
        }

        main()
    }

    function resendToken() {
        async function main() {
            let token = authData?.token
            if(token === undefined)
                return

            await UserResendVerification(token)
            showNotification({
                title: "Resent Email",
                message: "Successfully resent the email",
                color: 'green',
                autoClose: 1000 * 10
            })
        }

        main()
    }

    const logoutCallback = useCallback(() => {
        async function main() {
            let token = authData?.token
            if(logout === undefined || token === undefined)
                return

            await logout(token)
        }

        main()
    }, [logout, authData])

    useEffect(() => {
        if(loaded !== true)
            return

        if(loggedIn === false)
            router.push('/')
        if(verified === true)
            router.push('/drive')
    }, [loggedIn, verified, loaded])
    
    return (
        <>
            <div className={styles.panel}>
                <Logo />

                <div className={styles.subtext}>
                    <div className={styles.focus}>One Last Step</div>
                    <div className={styles.shadow}>
                        We sent a code to your email to verify that you are a real user!
                    </div>
                </div>

                <div className={`${styles.screenshot} ${styles.email}`}></div>
            </div>

            <div className={styles.content}>
                <div className={styles.loginWrapper}>
                    <div className={styles.title}>Check your E-Mail!</div>
                    <LoadingOverlay visible={visible} loaderProps={{ size: 'sm', color: 'blue', variant: 'oval' }} overlayOpacity={0.3} overlayColor="#c5c5c5"/>
                    <form className={styles.form} onSubmit={onSubmit}>
                        <TextInput 
                            required
                            withAsterisk
                            label={"Verification Code"}
                            size={"md"}
                            variant={"filled"}
                            type={"text"}
                            placeholder={"Code from E-Mail"}
                            styles={{ input: { height: 40 } }}
                            {...form.getInputProps('token')}
                        />

                        <Button
                            type={'submit'}
                            size={'md'}
                            mt={20}
                            radius={"xl"}
                        >
                            Verify
                        </Button>
                    </form>
                </div>

                <div className={styles.actionText}>
                    Didn't Receive an E-Mail?{' '}
                    
                    <Link href={"#"} onClick={resendToken}>
                        <span className={styles.link}>
                            Resend E-Mail
                        </span>
                    </Link>
                </div>

                <Link href={"#"} onClick={() => logoutCallback()}>
                    <div className={styles.actionText}>
                        <span className={styles.link}>
                            Logout
                        </span>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default VerifyPageComponent
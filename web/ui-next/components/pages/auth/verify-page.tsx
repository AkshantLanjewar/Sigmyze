import { TextInput, Button } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import Link from "next/link"
import { useRouter } from "next/router"
import { FormEvent, useContext, useEffect } from "react"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import { UserResendVerification } from "../../data/user/user-api"
import Logo from "../../nav-elements/logo/logo"
import styles from './auth-styles.module.scss'

const VerifyPageComponent: React.FC = ({ }) => {
    const form = useForm({
        initialValues: {
            token: '',
        },
    })

    const userContext = useContext(UserContextData) as IUserContext
    const router = useRouter()

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        async function main() {
            if(userContext.verify === undefined)
                return
            if(userContext.authData?.token === undefined)
                return

            let code = form.values.token
            await userContext.verify(userContext.authData.token, code)
        }

        main()
    }

    function resendToken() {
        async function main() {
            let token = userContext.authData?.token
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

    useEffect(() => {
        if(userContext.loggedIn === false)
            router.push('/')
        if(userContext.verified === true)
            router.push('/drive')
    }, [userContext.loggedIn, userContext.verified])
    
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

                    <form className={styles.form} onSubmit={onSubmit}>
                        <TextInput 
                            required
                            withAsterisk
                            label={"Verification Code"}
                            size={"md"}
                            variant={"filled"}
                            type={"email"}
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

                <Link href={"#"}>
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
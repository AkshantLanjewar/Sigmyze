import { Button, MantineProvider, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import Link from 'next/link'
import { FormEvent } from 'react'
import { theme } from '../../components/default-theme'
import Logo from '../../components/nav-elements/logo/logo'
import styles from './auth-styles.module.scss'

const VerifyPage: React.FC = ({ }) => {
    const form = useForm({
        initialValues: {
            token: '',
        },
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
                        
                        <Link href={"#"}>
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
            </MantineProvider>
        </div>
    )
}

export default VerifyPage
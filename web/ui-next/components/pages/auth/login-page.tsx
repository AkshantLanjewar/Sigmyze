import { TextInput, Button, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useContext, useEffect } from 'react'
import { UserContextData } from '../../data/user/context'
import { IUserContext } from '../../data/user/types'
import Logo from '../../nav-elements/logo/logo'
import styles from './auth-styles.module.scss'

const LoginPageComponent: React.FC = ({ }) => {
    const form = useForm({
        initialValues: {
            email: '',
            password: ''
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        }
    })

    const userContext = useContext(UserContextData) as IUserContext
    const router = useRouter()

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        form.validate()

        async function main() {
            let email = form.values.email
            let password = form.values.password
            if(userContext.login === undefined)
                return
            
            await userContext.login(email, password)
            router.push('/drive')
        }

        main()
    }

    useEffect(() => {
        if(userContext.loggedIn === true)
            router.push('/drive')
    }, [userContext.loggedIn])
    
    return (
        <>
            <Head>
                <title>Sigmyze Login</title>
                <meta name="description" content={"Login to Sigmyze"} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            
            <div className={styles.panel}>
                <Logo />

                <div className={styles.subtext}>
                    <div className={styles.focus}>Analyze Everything</div>
                    <div className={styles.shadow}>Check out our new document and chart editors</div>
                </div>

                <div className={`${styles.screenshot} ${styles.chart}`}></div>
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

                        <Button
                            type={'submit'}
                            size={'md'}
                            mt={20}
                            radius={"xl"}
                        >
                            Log in
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
        </>
    )
}

export default LoginPageComponent
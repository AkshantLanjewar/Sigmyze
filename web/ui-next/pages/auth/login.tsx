import Logo from '../../components/nav-elements/logo/logo'
import Link from 'next/link'
import styles from './auth-styles.module.scss'
import chartEditorScreenshot from '../../public/screenshots/chart-editor.png'

/**
 * @description
 *  this is the login form for the website
 */
const LoginPage: React.FC = ({ }) => {
    return (
        <div className={styles.wrapper}>
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
        </div>
    )
}

export default LoginPage
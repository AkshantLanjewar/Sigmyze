import { Button } from '@mantine/core'
import Link from 'next/link'
import styles from './footer.module.scss'
import Logo from '../logo/logo'

/**
 * @figma Container: Navbar Component Component: Footer
 * @description
 *  this is the footer at the bottom of most unauthorized pages
 *  it contains links to important pages on the site, along with 
 *  a banner to drive user account creation.
 * @returns Footer
 */
const Footer: React.FC = ({ }) => {
    return (
        <div className={styles.footer}>
            <div className={styles.actionBanner}>
                <h2 className={styles.title}>Save Time Now</h2>

                <Link href={"/signup"}>
                    <Button
                        radius={"xl"}
                        size={"lg"}
                        color={"indigo"}
                    >
                        Get Started
                    </Button>
                </Link>
            </div>

            <div className={styles.links}>
                <Logo />

                <div className={styles.wrapper}>
                    <div className={styles.col}>
                        <div className={styles.title}>Information</div>

                        <div className={styles.links_footer}>
                            <Link href={"/features"}>
                                <div className={styles.link}>Features</div>
                            </Link>

                            <Link href={"/datasets"}>
                                <div className={styles.link}>Datasets</div>
                            </Link>

                            <Link href={"/about"}>
                                <div className={styles.link}>Additional Info</div>
                            </Link>
                        </div>
                    </div>

                    <div className={styles.col}>
                        <div className={styles.title}>Social Media</div>

                        <div className={styles.links_footer}>
                            <Link 
                                href={"https://twitter.com/sigmyze"} 
                                target={"_blank"}
                            >
                                <div className={styles.link}>Twitter</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
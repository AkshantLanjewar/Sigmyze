import { Button } from '@mantine/core'
import Link from 'next/link'
import styles from './footer.module.scss'
import Logo from './logo'

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
            </div>
        </div>
    )
}

export default Footer
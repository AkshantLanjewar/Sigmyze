import { Button } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { UserContextData } from "../data/user/context"
import { IUserContext } from "../data/user/types"
import Footer from "../nav-elements/footer/footer"
import styles from './home.module.scss'

const IndexPage: React.FC = ({ }) => {
    const { loggedIn } = useContext(UserContextData) as IUserContext
    const router = useRouter()

    useEffect(() => {
        if(loggedIn === true)
            router.replace('/drive')
    }, [])
    
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div className={styles.hero}>
                <div className={styles.textContainer}>
                    <div className={styles.small}>Get Started</div>
                    <div className={styles.bold}>
                        Democratizing <span className={styles.focus}>Data</span> and 
                        <span className={styles.focus}> Analytics</span>
                    </div>

                    <div className={styles.actions}>
                        <Link href={"/auth/signup"}>
                            <Button
                                variant={"filled"}
                                color={"indigo"}
                                size={"lg"}
                                radius={"xl"}
                                py={1}
                            >
                                Get Started
                            </Button>
                        </Link>

                        <Link href={"/features"}>
                            <Button
                                variant={"subtle"}
                                color={"gray"}
                                size={"lg"}
                                radius={"xl"}
                                py={1}
                            >
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className={styles.imageContainer}>
                    <div className={styles.image}></div>
                </div>
            </div>


            <Footer />
        </div>
    )
}

export default IndexPage
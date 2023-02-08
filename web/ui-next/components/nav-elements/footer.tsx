import { Box, Button } from '@mantine/core'
import Link from 'next/link'
import Image from 'next/image'
import styles from './footer.module.scss'
import logo  from '../../public/logo.svg'

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
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        height: 60,
                        cursor: 'pointer',
                        width: 'min-content' 
                    }}
                >
                    <Image 
                        src={logo} 
                        height={35} 
                        alt={"Sigmyze Logo"} 
                        style={{ marginRight: 5 }}
                    />

                    <Box 
                        sx={{
                            fontSize: 26,
                            fontWeight: 700,
                            textAlign: 'center',
                            fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif',
                            display: 'table-cell',
                            verticalAlign: 'middle'
                        }}
                    >
                        Sigmyze
                    </Box>
                </Box>
            </div>
        </div>
    )
}

export default Footer
import { Navbar } from '@mantine/core'
import { IconDatabase, IconDeviceFloppy, IconGlobe } from '@tabler/icons'
import Link from 'next/link'
import DriveCreateItem from './drive-create-item'
import styles from './sidebar.module.scss'

interface ISidebarProps {
    location: string
}

/**
 * @param location
 *  this is the current location of the page
 * @description
 *  this is the sidebar that is shown in protected routes
 *  if this sidebar is shown on the lunar page incorporate
 *  the stack explorer as well.
 */
const Sidebar: React.FC<ISidebarProps> = ({ location }) => {
    return (
        <Navbar width={{ base: 80 }}>
            <div className={styles.sidebarWrapper}>
                <div className={styles.elements}>
                    {location === '/drive' && (
                        <>
                            <DriveCreateItem />
                        </>
                    )}

                    <Link href={"/drive"}>
                        <div className={`${styles.element} ${location === '/drive' && styles.active}`}>
                            <IconDeviceFloppy />
                        </div>
                    </Link>

                    <Link href={"/lunar"}>
                        <div className={`${styles.element} ${location === '/lunar' && styles.active}`}>
                            <IconGlobe />
                        </div>
                    </Link>

                    <Link href={"/datasets"}>
                        <div className={`${styles.element}`}>
                            <IconDatabase />
                        </div>
                    </Link>
                </div>
            </div>
        </Navbar>
    )
}

export default Sidebar
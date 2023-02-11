import styles from '../header.module.scss'
import Link from 'next/link'

/**
 * @description
 *  This is the component that holds all the menu items for the header
 * @returns header menu items
 */
const MenuItems: React.FC = ({ }) => {
    return (
        <div className={styles.menuItems}>
            <Link href={"/"}>
                <div className={styles.item}>Home</div>
            </Link>

            <Link href={"/datasets"}>
                <div className={styles.item}>Datasets</div>
            </Link>

            <Link href={"/features"}>
                <div className={styles.item}>Features</div>
            </Link>

            <Link href={"/about"}>
                <div className={styles.item}>Additional Info</div>
            </Link>
        </div>
    )
}

export default MenuItems
import styles from './logo.module.scss'
import Image from 'next/image'
import logo  from '../../../public/logo.svg'

/**
 * @description 
 *  this is the logo with text
 * @returns 
 */
const Logo: React.FC = ({ }) => {
    return (
        <div className={styles.logo}>
            <Image 
                src={logo} 
                height={35} 
                alt={"Sigmyze Logo"} 
                style={{ marginRight: 5 }}
            />

            <div className={styles.text}>Sigmyze</div>
        </div>
    )
}

export default Logo
import { useEffect, useState } from 'react'
import { IQuantaRFNodeStyles, IQuantaXYPos } from '../types/types'
import styles from './quanta-group.module.scss'

interface IQuantaGroupProps {
    
}

const QuantaGroup: React.FC<IQuantaGroupProps> = ({ }) => {
    return (
        <div className={styles.quanta__group}>
            <div className={styles.inner}>
                
            </div>
        </div>
    )
}

export default QuantaGroup
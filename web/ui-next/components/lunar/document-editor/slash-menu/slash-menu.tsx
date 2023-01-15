import { ChartDims } from "../../chart-view/engine/types"
import styles from './slash-menu.module.scss'

interface ISlashMenuProps {
    position: ChartDims,
    inputActive: boolean,
    inputValue: string
}

const SlashMenu: React.FC<ISlashMenuProps> = ({ position, inputActive, inputValue }) => {
    return (
        <div className={styles['slash-wrapper']}>
            <div
                className={styles.slashMenu}
                style={{ 
                    top: position.y + 30, 
                    left: position.x,
                    opacity: inputActive ? 1 : 0
                 }}
            >

            </div>
        </div>
    )
}

export default SlashMenu
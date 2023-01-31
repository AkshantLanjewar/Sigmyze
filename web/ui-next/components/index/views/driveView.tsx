import OrganizationContext from "../../data/organization/context"
import DriveToolbar from "../drive/drive-toolbar/drive-toolbar"
import DriveData from "../drive/drive-data/drive-data"
import styles from './driveView.module.scss'
import { useState } from "react"
import { IDriveResp } from "../../data/organization/types"

const DriveView: React.FC = ({ }) => {
    const [driveData, setDriveData] = useState<IDriveResp | null>(null)
    const [modalState, setModalState] = useState<string | null>(null)

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div className={styles.driveWrapper}>
                <DriveToolbar 
                    driveData={driveData}
                    modalState={modalState}
                    setModalState={setModalState} 
                />

                <div className={styles.driveContainer}>
                    <div className={styles.scrollWrapper}>
                        <div className={styles.content}>
                            <DriveData
                                setModalState={setModalState} 
                                setDriveData={setDriveData} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DriveView
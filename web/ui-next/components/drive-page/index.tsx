import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { IDriveResp } from "../data/organization/types"
import { UserContextData } from "../data/user/context"
import { IUserContext } from "../data/user/types"
import DriveData from "./drive/drive-data/drive-data"
import DriveToolbar from "./drive/drive-toolbar/drive-toolbar"
import styles from './driveView.module.scss'

const DriveController: React.FC = ({ }) => {
    const [driveData, setDriveData] = useState<IDriveResp | null>(null)
    const [modalState, setModalState] = useState<string | null>(null)
    
    const { loggedIn } = useContext(UserContextData) as IUserContext
    const router = useRouter()

    useEffect(() => {
        if(loggedIn === false)
            router.replace('/')
    }, [])

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

export default DriveController
import QuantaContext from "../../data/quanta/context"
import ApplicationLayout from "../../nav-elements/application-layout"
import styles from '../../../pages/lunar/lunar.module.scss'
import { Group } from "@mantine/core"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import QToolbar from "../../quanta/toolbar"
import QViewport from "../../quanta/viewport"

const QuantaPage: React.FC = ({ }) => {
    const [projectId, setProjectId] = useState<string | null>(null)
    const [organizationId, setOrganizationId] = useState<string | null>(null)
    const { loggedIn, loaded } = useContext(UserContextData) as IUserContext
    const router = useRouter()

    useEffect(() => {
        let quantaId = router.query.quantaId 
        if(loaded === false)
            return
        if(loggedIn === false)
            router.push('/')
        if(Array.isArray(quantaId) && quantaId.length === 2) {
            setOrganizationId(quantaId[0])
            setProjectId(quantaId[1])
        }
    }, [loggedIn, loaded])

    return (
        <div style={{ height: '100%' }}>
            <QuantaContext quantaId={projectId} organizationId={organizationId}>
                <div style={{ height: '100%' }}> 
                    <Group
                        spacing={"xs"}
                        position={"apart"}
                        sx={{ height: '100%' }}
                        noWrap
                    >
                        <div className={styles.toolbar}>
                            <QToolbar />
                        </div>

                        <div className={styles.viewport}>
                            <QViewport />
                        </div>
                    </Group>
                </div>
            </QuantaContext>
        </div>
    )
}

export default QuantaPage
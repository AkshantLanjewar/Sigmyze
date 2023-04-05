import QuantaContext from "../../data/quanta/context"
import ApplicationLayout from "../../nav-elements/application-layout"
import styles from '../../../pages/lunar/lunar.module.scss'
import { Group } from "@mantine/core"
import QuantaToolbar from "../../lunar/toolbar/quanta-toolbar"
import QuantaViewport from "../../lunar/viewport/quanta-viewport"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"

const QuantaPage: React.FC = ({ }) => {
    const [projectId, setProjectId] = useState<string | null>(null)
    const { loggedIn, loaded } = useContext(UserContextData) as IUserContext
    const router = useRouter()

    useEffect(() => {
        let quantaId = router.query.quantaId 
        if(loaded === false)
            return
        if(loggedIn === false)
            router.push('/')
        if(Array.isArray(quantaId))
            setProjectId(quantaId[0])
    }, [loggedIn, loaded, router])

    return (
        <div style={{ height: '100%' }}>
            <QuantaContext>
                <div style={{ height: '100%' }}> 
                    <Group
                        spacing={"xs"}
                        position={"apart"}
                        sx={{ height: '100%' }}
                        noWrap
                    >
                        <div className={styles.toolbar}>
                            <QuantaToolbar />
                        </div>

                        <div className={styles.viewport}>
                            <QuantaViewport />
                        </div>
                    </Group>
                </div>
            </QuantaContext>
        </div>
    )
}

export default QuantaPage
import QuantaContext from "../../data/quanta/context"
import ApplicationLayout from "../../nav-elements/application-layout"
import styles from '../../../pages/lunar/lunar.module.scss'
import { Group } from "@mantine/core"
import QuantaToolbar from "../../lunar/toolbar/quanta-toolbar"
import QuantaViewport from "../../lunar/viewport/quanta-viewport"

const QuantaPage: React.FC = ({ }) => {
    return (
        <div>
            <ApplicationLayout
                title="Sigmyze: Quanta Editor"
                description="The sigmyze Quanta Editor"
                location="/quanta"
                protectedView={true}
            >
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
            </ApplicationLayout>
        </div>
    )
}

export default QuantaPage
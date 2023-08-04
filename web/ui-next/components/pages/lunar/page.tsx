import { Group } from "@mantine/core"
import LunarContext from "../../data/lunar/context"
import styles from '../../../pages/lunar/lunar.module.scss'
import Toolbar from "../../lunar/toolbar/toolbar"
import Viewport from "../../lunar/viewport/viewport"
import ApplicationLayout from "../../nav-elements/application-layout"
import QuantaDatasetManager from "../../ui/quanta-dataset-manager"

interface ILunarPageProps {
    
}

/**
 * @description
 *  this is the page layout for the lunar page
 *  this handles both when the user is accessing a protected project
 *  and a public one.
 * @param pkg
 *  this is the prefetched data from the server.
 *  it contains lists of datasets and their component indicators.
 * @returns 
 */
const LunarPage: React.FC<ILunarPageProps> = ({ }) => {
    return (
        <div>
            <ApplicationLayout
                title="Sigmyze: Lunar Editor"
                description=""
                location="/lunar"
                protectedView={true}
            >
                <QuantaDatasetManager>
                    <LunarContext>
                            <div style={{ height: '100%' }}>
                                <Group
                                    spacing={"xs"}
                                    position={"apart"}
                                    sx={{ height: '100%' }}
                                    noWrap
                                >
                                    <div className={styles.toolbar}>
                                        <Toolbar />
                                    </div>

                                    <div className={styles.viewport}>
                                        <Viewport />
                                    </div>
                                </Group>
                            </div>
                    </LunarContext>
                </QuantaDatasetManager>
            </ApplicationLayout>
        </div>
    )
}

export default LunarPage
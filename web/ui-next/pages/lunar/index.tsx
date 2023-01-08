import DefaultLayout from "../../components/default-layout"
import LunarContext  from "../../components/data/lunar/context"
import styles        from './lunar.module.scss'

import { 
    Group 
} from '@mantine/core'

import Toolbar  from "../../components/lunar/toolbar/toolbar"
import Viewport from "../../components/lunar/viewport/viewport"

const Lunar: React.FC = ({ }) => {
    return (
        <div>
                <DefaultLayout
                    title="Sigmyze: Lunar Editor"
                    description=""
                    location="/lunar"
                >
                    <LunarContext>
                        <div style={{ height: '100%' }}>
                            <Group
                                spacing={"xs"}
                                position={"apart"}
                                sx={{ height: '100%' }}
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
                </DefaultLayout>
        </div>
    )
}

export default Lunar
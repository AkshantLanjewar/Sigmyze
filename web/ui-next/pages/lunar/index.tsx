import DefaultLayout from "../../components/default-layout"
import LunarContext  from "../../components/data/lunar/context"
import styles        from './lunar.module.scss'

import { 
    Group 
} from '@mantine/core'

import Toolbar  from "../../components/lunar/toolbar/toolbar"
import Viewport from "../../components/lunar/viewport/viewport"

import { GetServerSidePropsContext } from "next"
import { GetDatasets, GetIndicators, GetObjects } from "../../components/data/datasets/DatasetsAPI"
import { IAddIndicatorData, RawIndicator } from "../../components/lunar/explorer-modals/add-indicator"
import { IDatasetObjects } from "../../components/data/datasets/DatasetsTypes"
import { pageStaticProps } from "../../components/lunar/page"

export const DefaultIndicatorTable = {
    weo: "USA"
}

interface ILunarProps {
    pkg: IAddIndicatorData
}

const Lunar: React.FC<ILunarProps> = ({ pkg }) => {
    return (
        <div>
            <DefaultLayout
                title="Sigmyze: Lunar Editor"
                description=""
                location="/lunar"
            >
                <LunarContext pkg={pkg}>
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
            </DefaultLayout>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return await pageStaticProps()
}

export type { ILunarProps }
export default Lunar
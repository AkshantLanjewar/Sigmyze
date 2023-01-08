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
import { IDatasetObjects, IObjectIndicator } from "../../components/data/datasets/DatasetsTypes"
import { DefaultIndicatorTable } from "../datasets/dataset/[dataset]"

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

export async function getStaticProps(context: GetServerSidePropsContext) {
    const datasets = await GetDatasets()
    let datasetsObject = [] as IDatasetObjects[]
    let indicatorsObject = [] as RawIndicator[]
    
    for(let i = 0; i < datasets.datasets.length; i++) {
        let dataset = datasets.datasets[i]
        let name    = dataset.name
        let data    = await GetObjects(name)

        const default_object = DefaultIndicatorTable[name.toLowerCase() as keyof typeof DefaultIndicatorTable]
        const indicators = await GetIndicators(name, default_object)
        let rawIndicator = {
            dataset: name,
            indicators: indicators.indicators
        } as RawIndicator

        datasetsObject.push({ dataset: name, objects: data.objects })
        indicatorsObject.push(rawIndicator)
    }

    let dataPKG         = {} as IAddIndicatorData
    dataPKG['datasets'] = datasets.datasets
    dataPKG['datasetsObject'] = datasetsObject
    dataPKG['indicators'] = indicatorsObject

    return {
        props: {
            pkg: dataPKG
        }
    }
}

export default Lunar
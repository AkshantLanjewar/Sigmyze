import { Group } from "@mantine/core"
import { DefaultIndicatorTable } from "../../../pages/lunar"
import { GetDatasets, GetObjects, GetIndicators } from "../../data/datasets/DatasetsAPI"
import { IDatasetObjects } from "../../data/datasets/DatasetsTypes"
import LunarContext from "../../data/lunar/context"
import { RawIndicator, IAddIndicatorData } from "../../lunar/explorer-modals/add-indicator"
import styles from '../../../pages/lunar/lunar.module.scss'
import Toolbar from "../../lunar/toolbar/toolbar"
import Viewport from "../../lunar/viewport/viewport"
import ApplicationLayout from "../../nav-elements/application-layout"

interface ILunarPageProps {
    pkg: IAddIndicatorData
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
const LunarPage: React.FC<ILunarPageProps> = ({ pkg }) => {
    return (
        <div>
            <ApplicationLayout
                title="Sigmyze: Lunar Editor"
                description=""
                location="/lunar"
                protectedView={true}
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
            </ApplicationLayout>
        </div>
    )
}

async function pageStaticProps() {
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

export { pageStaticProps }
export default LunarPage
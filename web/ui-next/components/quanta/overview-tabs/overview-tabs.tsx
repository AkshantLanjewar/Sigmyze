import { Tabs } from '@mantine/core'
import { IconBinaryTree2, IconFileCode, IconTable } from '@tabler/icons'
import styles from './overview-tabs.module.scss'
import IndicatorViewer from '../indicator-viewer'
import QuantaNodeViewer from '../quanta-node-viewer'
import SchemaEditor from '../schema-editor/schema-editor'

const OverviewTabs: React.FC = ({ }) => {
    return (
        <div>
            <Tabs 
                defaultValue={'preview'} 
                variant={'outline'}
                radius={'md'}
                keepMounted={false}
                sx={{ height: 500 }}
            >
                <Tabs.List pl={"xl"}>
                    <Tabs.Tab 
                        value='preview' 
                        icon={<IconTable size={14} stroke={"2"} />}
                    >
                        Dataset Preview
                    </Tabs.Tab>

                    <Tabs.Tab
                        value='create'
                        icon={<IconBinaryTree2 size={14} stroke={2} />}
                    >
                        Create Dataset
                    </Tabs.Tab>

                    <Tabs.Tab
                        value='update'
                        icon={<IconBinaryTree2 size={14} stroke={2} />}
                    >
                        Update Dataset
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value='preview'>
                    <IndicatorViewer />
                </Tabs.Panel>

                <Tabs.Panel value='create' style={{ height: '100%' }}>
                    <QuantaNodeViewer type={"create"} />
                </Tabs.Panel>

                <Tabs.Panel value='update' style={{ height: '100%' }}>
                    <QuantaNodeViewer type={"update"} />
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}

export default OverviewTabs
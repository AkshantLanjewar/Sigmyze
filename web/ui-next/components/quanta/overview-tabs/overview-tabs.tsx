import { Tabs } from '@mantine/core'
import { IconBinaryTree2, IconFileCode, IconTable } from '@tabler/icons'
import styles from './overview-tabs.module.scss'

const OverviewTabs: React.FC = ({ }) => {
    return (
        <div>
            <Tabs 
                defaultValue={'preview'} 
                variant={'outline'}
                radius={'md'}
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

                    <Tabs.Tab
                        value='schema'
                        icon={<IconFileCode size={14} stroke={2} />}
                    >
                        Dataset Schema
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value='preview'>

                </Tabs.Panel>

                <Tabs.Panel value='create'>

                </Tabs.Panel>

                <Tabs.Panel value='update'>

                </Tabs.Panel>

                <Tabs.Panel value='schema'>

                </Tabs.Panel>
            </Tabs>
        </div>
    )
}

export default OverviewTabs
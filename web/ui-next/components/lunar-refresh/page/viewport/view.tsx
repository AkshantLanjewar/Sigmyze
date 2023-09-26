import { Tabs } from '@mantine/core'
import styles from '../lunar-refresh.module.scss'
import { Dispatch, SetStateAction } from 'react'
import { ILunarTab } from './types'
import { IconFileRenderer } from '../../../ui/file-management/file-tree-view/file'

interface IViewProps {
    activeTab: string | null,
    tabs: ILunarTab[]
    setActiveTab: (val: string | null) => void
}

const LunarViewportView: React.FC<IViewProps> = ({ activeTab, tabs, setActiveTab }) => {
    return (
        <div className={styles.lunar__viewport} data-testId={'viewport'}>
            <Tabs
                keepMounted={false}
                activateTabWithKeyboard={false}
                color='indigo'
                value={activeTab}
                onTabChange={setActiveTab}
            >
                <Tabs.List data-testId={'viewport-tabs'}>
                    {tabs.map((step, index) => (
                        <Tabs.Tab
                            value={step.tabId}
                            data-testId={`viewport-tab-${index}`}
                            icon={IconFileRenderer(step.tabType)}
                        >
                            {step.tabName}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                <div data-testId={'viewport-display'}>

                </div>
            </Tabs>
        </div>
    )
}

export default LunarViewportView
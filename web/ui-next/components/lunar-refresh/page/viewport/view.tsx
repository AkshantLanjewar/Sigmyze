import { Tabs } from '@mantine/core'
import styles from '../lunar-refresh.module.scss'
import { Dispatch, SetStateAction, memo } from 'react'
import { ILunarPane, ILunarTab } from './types'
import { IconFileRenderer } from '../../../ui/file-management/file-tree-view/file'

/**
 * NOTE: The data-testId viewport-display only goes on the tab panels
 */

interface IViewProps {
    activeTab: string | null,
    tabs: ILunarTab[],
    panes: ILunarPane[],
    setActiveTab: (val: string | null) => void,
}

const LunarViewportView: React.FC<IViewProps> = memo(({ activeTab, tabs, panes, setActiveTab }) => {
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
                            data-testValue={`${activeTab === step.tabId ? 'active' : ''}`}
                        >
                            {step.tabName}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                {panes.map((step) => (
                    <Tabs.Panel
                        style={{ flexGrow: 1 }}
                        value={step.paneId}
                        data-testId={'viewport-display'}
                    >
                        
                    </Tabs.Panel>
                ))}
            </Tabs>
        </div>
    )
})

export default LunarViewportView
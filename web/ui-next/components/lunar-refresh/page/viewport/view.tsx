import { ActionIcon, Tabs } from '@mantine/core'
import styles from '../lunar-refresh.module.scss'
import { Dispatch, SetStateAction, memo, useContext } from 'react'
import { ILunarPane, ILunarTab } from './types'
import { IconFileRenderer } from '../../../ui/file-management/file-tree-view/file'
import { LunarUIContextData } from '../../ui-context'
import { ILunarUIState } from '../../ui-context/state'
import { IconX } from '@tabler/icons'

interface ICloseButtonProps {
    tabId: string
}

const CloseButton: React.FC<ICloseButtonProps> = ({ tabId }) => {
    const { closeTab } = useContext(LunarUIContextData) as ILunarUIState

    return (
        <ActionIcon
            variant={"transparent"}
            color="red"
            aria-label="close"
            data-testId={'close-tab'}
            onClick={(e) => {
                e.stopPropagation()
                closeTab(tabId)
            }}
            size={"sm"}
        >
            <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
    )
}

/**
 * NOTE: The data-testId viewport-display only goes on the tab panels
 */

interface IViewProps {
    activeTab: string | null,
    tabs: ILunarTab[],
    panes: ILunarPane[],
    paneType: string | undefined,
    setActiveTab: (val: string | null) => void
}

const LunarViewportView: React.FC<IViewProps> = memo(({ activeTab, tabs, panes, paneType, setActiveTab }) => {
    return (
        <div className={styles.lunar__viewport} data-testId={'viewport'}>
            <Tabs
                keepMounted={false}
                activateTabWithKeyboard={false}
                color='indigo'
                value={activeTab}
                onTabChange={setActiveTab}
                style={{
                    display: 'flex',
                    flexDirection: "column",
                    flexGrow: 1,
                    width: "100%"
                }}
            >
                <Tabs.List data-testId={'viewport-tabs'}>
                    {tabs.map((step, index) => (
                        <Tabs.Tab
                            value={step.tabId}
                            data-testId={`viewport-tab-${index}`}
                            icon={IconFileRenderer(step.tabType)}
                            data-testValue={`${activeTab === step.tabId ? 'active' : ''}`}
                            rightSection={<CloseButton tabId={step.tabId} />}
                            key={step.tabId + activeTab}
                            style={{
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {step.tabName}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
                
                <div 
                    data-testId={'viewport-display'} 
                    data-testvalue={paneType ? paneType : "undefined"}
                    style={{ 
                        display: 'flex',
                        flexGrow: 1,
                        position: 'relative' 
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,

                            overflowY: 'auto'
                        }}
                    >
                        {panes.map((step) => (
                            <Tabs.Panel 
                                value={step.paneId}
                                style={{
                                    height: "100%" ,
                                    width: "100%" 
                                }}
                            >
                                {step.paneContent}
                            </Tabs.Panel>
                        ))}
                    </div>
                </div>
            </Tabs>
        </div>
    )
})

export default LunarViewportView
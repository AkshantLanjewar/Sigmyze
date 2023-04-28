import { useContext } from 'react'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import { ActionIcon, Tabs } from '@mantine/core'
import styles from './viewport.module.scss'
import { icon_table } from '../../tree/node'
import { RxCross2 } from 'react-icons/rx'
import QuantaOverviewView from '../../quanta/overview/overview-view'
import QuantaSelectorsView from '../../quanta/selectors/selectors-view'
import QuantaEditor from '../../quanta/quanta-editor/quanta-editor'
import SocketHandler from '../../ui/socket-handler'

const QuantaViewport: React.FC = ({ }) => {
    const quantaContext = useContext(QuantaContextData) as IQuantaState
    let quantaTabs = quantaContext.tabs
    let activeTab = quantaContext.tabId

    let tabHeaders = undefined
    let tabBody = undefined

    if(quantaTabs !== undefined) {
        tabHeaders = quantaTabs.map((step) => (
            <Tabs.Tab
                value={step.tabId!}
                icon={icon_table[step.tabType as keyof typeof icon_table]}
                className={styles.tabWrapper}
            >
                <div className={styles.content}>
                    {step.tabName}

                    <ActionIcon
                        size={"sm"}
                        variant={"transparent"}
                        className={styles.icon}
                        onClick={() => { quantaContext.closeTab(step.tabId!) }}
                    >
                        <RxCross2 size={14} />
                    </ActionIcon>
                </div>
            </Tabs.Tab>
        ))

        tabBody = quantaTabs.map((step) => {
            let viewPanel = null
            if(step.connected_file === undefined || step.tabName === undefined)
                return

            if(step.tabType === "overview")
                viewPanel = <QuantaOverviewView />
            if(step.tabType === "selectors")
                viewPanel = <QuantaSelectorsView />
            if(step.tabType === "node_editor")
                viewPanel = <QuantaEditor fileId={step.connected_file} fileName={step.tabName} />

            return (
                <Tabs.Panel
                    value={step.tabId!}
                    sx={{ flexGrow: 1, position: 'relative' }}
                >
                    <div className={styles.viewportScroll}>
                        {viewPanel}
                    </div>
                </Tabs.Panel>
            )
        })
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.viewport}>
                <SocketHandler>
                    {activeTab && (
                        <Tabs
                            color={"indigo"}
                            radius={"sm"}
                            value={activeTab}
                            onTabChange={(val) => { quantaContext.changeTab(val!) }}
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Tabs.List
                                sx={(theme) => ({ backgroundColor: theme.colors.dark[9], borderTopLeftRadius: 4 })}
                            >
                                {tabHeaders}
                            </Tabs.List>

                            {tabBody}
                        </Tabs>
                    )}
                </SocketHandler>
            </div>
        </div>
    )
}

export default QuantaViewport
import React, { useContext, useMemo } from 'react'
import styles from '../../lunar/viewport/viewport.module.scss'
import { QuantaUIContextData } from '../../data/quanta/ui-context'
import { IQuantaUIState } from '../../data/quanta/ui-context/state'
import { ActionIcon, Tabs } from '@mantine/core'
import { icon_table } from '../../tree/node'
import QuantaOverviewView from '../overview/overview-view'
import QuantaSelectorsView from '../selectors/selectors-view'
import QuantaEditor from '../quanta-editor/quanta-editor'
import CodeEditor from '../../ui/code-editor'
import QViewportView from './view'

const QViewport: React.FC = ({ }) => {
    const { tabId, changeTab, closeTab, tabs } = useContext(QuantaUIContextData) as IQuantaUIState

    //user states
    const tabHeaders = useMemo(() => {
        if(tabs === undefined)
            return undefined

        return tabs.map((step) => (
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
                        onClick={() => { closeTab(step.tabId!) }}
                    >

                    </ActionIcon>
                </div>
            </Tabs.Tab>
        ))
    }, [tabs, closeTab])

    const tabBodies = useMemo(() => {
        if(tabs === undefined)
            return undefined

        return tabs.map((step) => {
            let viewPanel = null
            if(step.connected_file === undefined || step.tabName === undefined)
                return

            if(step.tabType === "overview")
                viewPanel = <QuantaOverviewView />
            if(step.tabType === "selectors")
                viewPanel = <QuantaSelectorsView />
            if(step.tabType === "node_editor")
                viewPanel = <QuantaEditor fileId={step.connected_file} fileName={step.tabName} />
            if(step.tabType === "code::selector")
                viewPanel = <CodeEditor codeId={step.connected_file} />

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
    }, [tabs])

    return (
        <QViewportView
            activeTab={tabId}
            tabHeaders={tabHeaders}
            tabBody={tabBodies}
            changeTab={changeTab}
        />
    )
}

export default QViewport
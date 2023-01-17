import { ActionIcon, Tabs } from '@mantine/core'
import { useContext } from 'react'
import { LunarContextData } from '../../data/lunar/context/context'
import { ILunarState } from '../../data/lunar/types'
import { icon_table } from '../../tree/node'
import ChartView from '../chart-view/chart-view'
import DocumentEditor from '../document-editor/document-editor'
import styles from './viewport.module.scss'
import { RxCross2 } from 'react-icons/rx'

const Viewport: React.FC = ({ }) => {
    const { 
        ui,
        changeTab,
        closeTab 
    } = useContext(LunarContextData) as ILunarState

    let tabHeaders = null
    let tabBodies  = null
    if((ui !== undefined || ui !== null) && ui?.tabs !== undefined) {
        tabHeaders = ui!.tabs.map((step) => (
            <Tabs.Tab
                value={step.tab_id}
                icon={icon_table[step.tab_type]}
                className={styles.tabWrapper}
            >
                <div className={styles.content}>
                    {step.tab_name}

                    <ActionIcon 
                        size={"sm"} 
                        className={styles.icon}
                        variant={"transparent"}
                        onClick={() => { closeTab(step.tab_id) }}
                    >
                        <RxCross2 size={14} />
                    </ActionIcon>
                </div>
            </Tabs.Tab>
        ))

        tabBodies = ui!.tabs.map((step => {
            let panelBody = null
            if(step.tab_type === "chart")
                panelBody = <ChartView tabId={step.tab_id} />
            if(step.tab_type === "document")
                panelBody = <DocumentEditor tabId={step.tab_id} />

            return (
                <Tabs.Panel
                    value={step.tab_id}
                    sx={{ flexGrow: 1 }}
                >
                    {panelBody}
                </Tabs.Panel>
            )
        }))
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.viewport}>
                {ui === null
                    ? null
                    : (
                        <Tabs
                            color={"indigo"}
                            radius={"sm"}
                            value={ui!.activeTab}
                            onTabChange={(val) => { changeTab(val!) }}
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

                            {tabBodies}
                        </Tabs>
                    )
                }
            </div>
        </div>
    )
}

export default Viewport
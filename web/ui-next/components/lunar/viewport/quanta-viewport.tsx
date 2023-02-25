import { useContext } from 'react'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import { ActionIcon, Tabs } from '@mantine/core'
import styles from './viewport.module.scss'
import { icon_table } from '../../tree/node'
import { RxCross2 } from 'react-icons/rx'

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
            return (
                <Tabs.Panel
                    value={step.tabId!}
                    sx={{ flexGrow: 1 }}
                >

                </Tabs.Panel>
            )
        })
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.viewport}>
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
                    </Tabs>
                )}
            </div>
        </div>
    )
}

export default QuantaViewport
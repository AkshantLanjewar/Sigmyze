import { memo } from 'react'
import styles from '../../lunar/viewport/viewport.module.scss'
import SocketHandler from '../../ui/socket-handler'
import { Tabs } from '@mantine/core'

interface IViewProps {
    activeTab: string | undefined,
    tabHeaders: JSX.Element[] | undefined,
    tabBody: (JSX.Element | undefined)[] | undefined,
    changeTab: (tabId: string) => void
}

const QViewportView: React.FC<IViewProps> = memo(({ 
    activeTab,
    tabHeaders,
    tabBody,
    changeTab 
}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.viewport}>
                <SocketHandler>
                    {activeTab && (
                        <Tabs
                            color={"indigo"}
                            radius={"sm"}
                            value={activeTab}
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

                            {tabBody}
                        </Tabs>
                    )}
                </SocketHandler>
            </div>
        </div>
    )
})

export default QViewportView
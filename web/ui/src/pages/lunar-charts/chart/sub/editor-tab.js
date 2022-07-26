import React, { useState } from 'react'

import { 
    Tabs, 
    Menu,
    CloseButton  
} from '@mantine/core'
import LunarChart from '../../../../components/lunar-chart/chart'
import useStyles  from '../chart.styles'

const TabHeader = ({ name, id, editable, deleteTab, icon }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 6,
                alignItems: 'center',
                justifyContent: 'apart',
                height: 22
            }}
        >
            {icon}
            {name}

            {editable
                ? ( <CloseButton size={'sm'} onClick={() => { deleteTab(id) }} />)
                : null
            }
        </div>
    )
}

const EditorTabs = ({ tabs, deleteTab }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id)

    return (
        <Tabs
            color='pink'
            sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            styles={{
                body: {
                    flexGrow: 1
                }
            }}
            radius={'sm'}
            value={activeTab}
            onTabChange={setActiveTab}
        >
            <Tabs.List>
                {tabs.map((step) => (
                    <Tabs.Tab
                        value={step.id}                        
                    >
                        <TabHeader 
                            name={step.name} 
                            id={step.id}
                            icon={step.icon}
                            editable={step.editable} 
                            deleteTab={deleteTab} 
                        />
                    </Tabs.Tab>
                ))}  
            </Tabs.List>
            
            {tabs.map((step) => (
                <Tabs.Panel 
                    value={step.id} 
                    pt={'xs'} 
                    sx={{ flexGrow: 1, height: "100%" }}
                >
                    <LunarChart
                        data={step.data}
                        names={step.names}
                        scale_change={activeTab}
                    />
                </Tabs.Panel>
            ))}
        </Tabs>
    )
}

export default EditorTabs
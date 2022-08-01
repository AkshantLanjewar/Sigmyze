import React, { useState, useEffect } from 'react'

import { 
    Tabs,
    Box 
} from '@mantine/core'

import TabHeader from './tab-header'
import TabView   from './tab-view'

import { connect } from 'react-redux'

import { HideTab } from '../../../data/actions/projectActions'

import { FaMix }        from 'react-icons/fa'
import { MdBarChart }   from 'react-icons/md'

let icon_dict = {
    "mix": <FaMix size={14} />,
    "bar": <MdBarChart size={14} />
}

const TabManager = ({ project, hide_tab }) => {
    const [active, setActive]         = useState(null)
    const [tabs, setTabs]             = useState([])

    useEffect(() => {
        setActive(project.tabs[0].id)

        let n_tabs = []
        for(let i = 0; i < project.tabs.length; i++) {
            let tab   = project.tabs[i]
            let n_tab = { ...tab }
            n_tabs.push(n_tab)
        }

        setTabs([...n_tabs])
    }, [project])

    return (
        <Box
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,

                backgroundColor: theme.colors.dark[8],
                height: "calc(100% - 10px)",
                borderRadius: theme.radius.md,
                marginRight: theme.spacing.md
            })}
        >
            <Tabs
                color={'pink'}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                styles={{
                    body: {
                        flexGrow: 1
                    }
                }}
                radius={'md'}
                value={active}
                onTabChange={setActive}
            >
                <Tabs.List>
                    {tabs.map((step) => (
                        <Tabs.Tab 
                            value={step.id}
                            key={`${step.id}-TAB`}
                        >
                            <TabHeader 
                                icon={icon_dict[step.icon]}
                                name={step.name}
                                editable={step.editable}
                                id={step.id}
                                deleteTab={() => { 
                                    hide_tab(step.id) 
                                    setActive(project.tabs[project.tabs.length - 1].id)
                                }}
                            />
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                {tabs.map((step) => (
                    <Tabs.Panel
                        value={step.id}
                        pt={'xs'}
                        sx={{ flexGrow: 1, height: "100%" }}
                        key={`${step.id}-PANEL`}
                    >
                        <TabView 
                            tab={step} 
                            scale_change={active} 
                        />
                    </Tabs.Panel>
                ))}
            </Tabs>
        </Box>
    )
}

const mapStateToProps = state => ({
    project: state.project
})

const mapDispatchToProps = dispatch => ({
    hide_tab: (tab_id) => dispatch(HideTab(tab_id))
})

export default connect(mapStateToProps, mapDispatchToProps)(TabManager)
import React, { useState, useEffect } from 'react'

import { 
    Tabs,
    Box,
    ScrollArea 
} from '@mantine/core'

import TabHeader from './tab-header'
import TabView   from './tab-view'

import { connect } from 'react-redux'

import { HideTab } from '../../../data/actions/projectActions'

import { FaMix }          from 'react-icons/fa'
import { MdBarChart }     from 'react-icons/md'
import { HiDocumentText } from 'react-icons/hi'
import { MdPublish }      from 'react-icons/md'

import { usePrevious } from "../../../components/lib"

let icon_dict = {
    "mix": <FaMix size={14} />,
    "bar": <MdBarChart size={14} />,
    "doc": <HiDocumentText size={14} />,
    "pub": <MdPublish size={14} />
}

const TabManager = ({ project, hide_tab }) => {
    const [active, setActive]         = useState(null)
    const [tabs, setTabs]             = useState([])
    const tabLengthPrev               = usePrevious(tabs.length)

    useEffect(() => {
        setTabs([...project.tabs])
    }, [project])

    useEffect(() => {
        //check if current active in tabs
        let activeFound = false
        for(let i = 0; i < tabs.length; i++) {
            let tab = tabs[i]
            if(tab.id == active)
                activeFound = true
        }

        if(tabs.length == 0)
            return
        if(active == null || !activeFound)
            setActive(tabs[0].id)
        if(tabs.length > tabLengthPrev)
            setActive(tabs[tabs.length - 1].id)
    }, [tabs])

    return (
        <Box
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,

                backgroundColor: theme.colors.dark[8],
                height: "calc(100% - 10px)",
                borderRadius: theme.radius.md,
                marginRight: theme.spacing.xs
            })}

            id={"workspace-panel-lunar"}
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
                        key={`${step.id}-PANEL`}

                        sx={{ 
                            flexGrow: 1, 
                            flexBasis: 0,
                            height: "100%" 
                        }}
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
import { v4 as uuidv4 } from 'uuid'

let default_tab = {
    name: 'Combined Chart',
    icon: "mix",
    editable: false,
    type: 'chart',
    id: uuidv4(),

    indicators: []
}

let default_state = {
    project_name: "",
    project_id: "demo",
    project_data: {
        indicators: [],
        documents: []
    },

    tabs: [default_tab]
}

/*
    DATA SCHEMAS

    INDICATOR
        1. indicator_id 
        2. object_id
        3. dataset

    DOCUMENT
        1. document_id
        2. document_name
        3. document_content
        4. data_location
*/

export default ( state = default_state, action ) => {
    let e_state    = state
    let payload    = action.payload

    let project_data = e_state['project_data']
    let indicators   = []
    let documents    = []

    let tabs   = state.tabs
    let n_tabs = []

    switch(action.type) {
        case "set_project_name":
            e_state['project_name'] = payload.project_name
            return { ...e_state }
        case "set_project_id":
            e_state['project_id'] = payload.project_id
            return { ...e_state }
        case "add_indicator":
            if(!project_data['indicators'].includes(payload))
                project_data['indicators'].push(payload)
            
            let n_tab = {
                name: `${payload.object_id}: ${payload.indicator_id}`,
                icon: "bar",
                editable: true,
                type: 'chart',
                indicators: [payload],

                id: uuidv4(),
            }
            
            tabs[0].indicators.push(payload)
            tabs.push(n_tab)

            tabs[0].indicators         = [...new Set(tabs[0].indicators)]
            project_data['indicators'] = [...new Set(project_data['indicators'])]
            e_state['project_data']    = project_data
            e_state['tabs']            = tabs

            return { ...e_state }
        case "remove_indicator":
            for(let i = 0; i < e_state.project_data.indicators.length; i++) {
                let indicator = e_state.project_data.indicators[i]

                if(indicator.object_id == payload.object_id && indicator.indicator_id == payload.indicator_id)
                    continue
                indicators.push(indicator)
            }

            tabs[0].indicators = indicators
            n_tabs.push(tabs[0])

            for(let i = 0; i < tabs.length; i++) {
                if(i == 0)
                    continue
                
                let tab   = tabs[i]
                if(tab.type !== "chart")
                    continue

                let tab_i = tab.indicators[0]

                if(tab_i.object_id == payload.object_id && tab_i.indicator_id == payload.indicator_id)
                    continue
                n_tabs.push(tab)
            }

            e_state['project_data']['indicators'] = indicators
            e_state['tabs']                       = n_tabs
            return { ...e_state }
        case "hide_tab":
            let tab_id = payload.tab_id
            n_tabs.push(tabs[0])

            for(let i = 0; i < tabs.length; i++) {
                if(i == 0)
                    continue
                
                let tab = tabs[i]
                if(tab.id == tab_id)
                    continue
                n_tabs.push(tab)
            }

            e_state['tabs'] = n_tabs
            return { ...e_state }
        case "open_chart_tab":
            let o_tab = {
                name: `${payload.object_id}: ${payload.indicator_id}`,
                icon: "bar",
                editable: true,
                type: 'chart',
                indicators: [payload],

                id: uuidv4(),
            }

            tabs.push(o_tab)
            e_state['tabs'] = [...new Set(tabs)]
            return { ...e_state }
        case "open_document_tab":
            let do_tab = {
                name: payload.document_name,
                icon: "doc",
                editable: true,
                type: 'document',
                data_loc: payload.data_location,

                id: uuidv4()
            }

            tabs.push(do_tab)
            e_state['tabs'] = [...new Set(tabs)]
            return { ...e_state }
        case "remove_all_indicator":
            e_state['project_data']['indicators'] = indicators
            e_state['project_data']['documents']  = documents
            e_state['tabs']                       = [default_tab]

            return { ...e_state }
        case "add_document":
            project_data['documents'].push(payload)
            let d_tab = {
                name: payload.document_name,
                icon: "doc",
                editable: true,
                type: 'document',
                data_loc: payload.data_location,

                id: uuidv4()
            }
            
            e_state['tabs'].push(d_tab)
            e_state['tabs']         = [...new Set(e_state['tabs'])]
            e_state['project_data'] = project_data

            return { ...e_state }
        case "remove_document":
            for(let i = 0; i < project_data.documents.length; i++) {
                let document = project_data.documents[i]

                if(document.document_id == payload.document_id)
                    continue
                documents.push(document)
            }

            n_tabs.push(tabs[0])

            for(let i = 0; i < tabs.length; i++) {
                if(i == 0)
                    continue

                let tab   = tabs[i]
                if(tab.data_loc == payload.data_loc)
                    continue
                n_tabs.push(tab)
            }

            project_data['documents'] = documents
            e_state['tabs']           = n_tabs
            e_state['project_data']   = project_data
            return { ...e_state }
        case "set_document_content":
            let content      = payload.blocks
            let document_loc = payload.document_location

            for(let i = 0; i < project_data.documents.length; i++) {
                let document = project_data.documents[i]

                if(document.data_location == document_loc)
                    document['document_content'] = content
                project_data.documents[i] = document
            }

            e_state['project_data'] = project_data
            return { ...e_state }
        default: 
            return e_state
    }
}
import React, { useState, useEffect } from 'react'

import { Box }         from '@mantine/core'
import { 
    ExtractData,
    ExtractPane,
    PrebuiltLayouts 
} from './polis-data'

import { useParams } from 'react-router-dom'

const Polis = ({ polis_id }) => {
    let { 
        polisId,
        layoutId,
        dataId
    } = useParams()

    const [polisData, setPolisData] = useState({})
    const [panes, setPanes]         = useState([])
    const [viewPanes, setViewPanes] = useState([])
    const [pageId, setPageId]       = useState(null)

    useEffect(() => {
        if(polisId !== undefined)
            setPageId(polisId)
        if(polis_id !== undefined)
            setPageId(polis_id)
    }, [])

    useEffect(() => {
        if(pageId == null)
            return
        
        let url = `/api/v1/polis/get/${pageId}`
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if('error' in data)
                    return
                
                let p_data   = data['data']
                setPolisData({ ...p_data })

                if(layoutId === undefined)
                    setPanes([ ...data['active_layout']['panes'] ])
                else
                    setPanes([ ...PrebuiltLayouts(layoutId) ])
            })
    }, [pageId, layoutId, dataId])

    useEffect(() => {
        let data      = {}
        let polis_cpy = polisData

        if(dataId !== undefined)
            data['dataId'] = dataId
        if(polisId !== undefined)
            data['polisId'] = polisId
        if(polis_id !== undefined)
            data['polisId'] = polis_id
        if(layoutId !== undefined)
            data['layoutId'] = layoutId

        for(let i = 0; i < panes.length; i++) {
            let pane_id = panes[i]['pane_id']
            ExtractData(data, polis_cpy, pane_id)
        }

        let d_panes = []
        for(let i = 0; i < panes.length; i++)
            d_panes.push(ExtractPane(data, panes[i]))
        setViewPanes([ ...d_panes ])
    }, [polisData, panes])

    return (
        <Box style={{ width: '100%', height: "calc(100vh - 60px)" }}>
            {viewPanes}
        </Box>
    )
}

export default Polis
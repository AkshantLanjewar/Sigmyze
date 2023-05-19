import { Dispatch, SetStateAction } from "react"
import { IQuantaSelector, IQuantaSelectorCode } from "../types/project"
import { IPipelineAnalysis, IPipelinedData } from "../../../quanta/selector-pane/context/types"

const newSelector = (
    selectorName: string, 
    selectorId: string,
    selectors: IQuantaSelector[],
    setSelectors: Dispatch<SetStateAction<IQuantaSelector[]>>,
    toggleSelectorsUpdated: () => void
) => {
    let nSelectors = selectors
    nSelectors.push({
        selectorName,
        selectorId,
        selectorDescription: "This is your selectors description. Click to edit."
    })

    setSelectors([ ...nSelectors ])
    toggleSelectorsUpdated()
}

const deleteSelector = (
    selectorId: string,
    selectors: IQuantaSelector[],
    eraseSchema: (id: string) => void,
    setSelectors: Dispatch<SetStateAction<IQuantaSelector[]>>,
    setActiveSelector: Dispatch<SetStateAction<string | null>>,
    toggleSelectorsUpdated: () => void
) => {
    eraseSchema(selectorId)
    let index: number | undefined = undefined
    let nSelectors = [] as IQuantaSelector[]

    for(let i = 0; i < selectors.length; i++) {
        let selector = selectors[i]
        if(selector.selectorId === selectorId) {
            index = i
            continue
        }

        nSelectors.push(selector)
    }

    if(index === undefined)
        return

    let updateActiveSelector = false
    if(index > nSelectors.length - 1) {
        index = nSelectors.length - 1
        updateActiveSelector = true
    } else {
        updateActiveSelector = true
    }
    
    if(nSelectors.length === 0) {
        updateActiveSelector = false
        setActiveSelector(null)
    }

    if(updateActiveSelector === true) {
        let selectorId = nSelectors[index].selectorId
        if(selectorId === undefined)
            return

        setActiveSelector(selectorId)
    }

    setSelectors([ ...nSelectors ])
    toggleSelectorsUpdated()
}

const addSelectorSource = (
    selectorId: string,
    selectorSource: IQuantaSelectorCode,
    selectors: IQuantaSelector[],
    setSelectors: Dispatch<SetStateAction<IQuantaSelector[]>>
) => {
    let nSelectors = []
    for(let i = 0; i < selectors.length; i++) {
        let selector = selectors[i]
        if(selector.selectorId === selectorId)
            selector.selectorCode = selectorSource

        nSelectors.push(selector)
    }

    setSelectors([ ...nSelectors ])
}

const editSelectorAnalysis = (
    selectorId: string,
    analysis: IPipelineAnalysis[],
    selectors: IQuantaSelector[],
    setSelectors: Dispatch<SetStateAction<IQuantaSelector[]>>
) => {
    let index: number | undefined = undefined
    for(let i = 0; i < selectors.length; i++) {
        let selector = selectors[i]
        if(selector.selectorId === selectorId)
            index = i
    }

    if(index === undefined)
        return

    let selector = selectors[index]
    if(selector.selectorPipeline === undefined)
        selector.selectorPipeline = { pipelinedObjects: [], pipelineAnalysis: [] }

    selector.selectorPipeline.pipelineAnalysis = analysis
    selectors[index] = selector
    setSelectors([ ...selectors ])
}

const editPipelineObjects = (
    selectorId: string,
    data: IPipelinedData[],
    selectors: IQuantaSelector[],
    setSelectors: Dispatch<SetStateAction<IQuantaSelector[]>>
) => {
    let index: number | undefined = undefined
    for(let i = 0; i < selectors.length; i++) {
        let selector = selectors[i]
        if(selector.selectorId === selectorId)
            index = i
    }

    if(index === undefined)
        return

    let selector = selectors[index]
    if(selector.selectorPipeline === undefined)
        selector.selectorPipeline = { pipelinedObjects: [], pipelineAnalysis: [] }

    selector.selectorPipeline.pipelinedObjects = data
    selectors[index] = selector
    setSelectors([ ...selectors ])
}

const editPipelineLinks = (
    selectorId: string,
    links: {[key: string]: string},
    selectors: IQuantaSelector[],
    setSelectors: Dispatch<SetStateAction<IQuantaSelector[]>>
) => {
    let index: number | undefined = undefined
    for(let i = 0; i < selectors.length; i++) {
        let selector = selectors[i]
        if(selector.selectorId === selectorId)
            index = i
    }

    if(index === undefined)
        return

    let selector = selectors[index]
    if(selector.selectorPipeline === undefined)
        selector.selectorPipeline = { pipelinedObjects: [], pipelineAnalysis: [] }

    selector.selectorPipeline.pipelineLinks = links
    selectors[index] = selector
    setSelectors([ ...selectors ])
}

const editSelectorTitle = (

) => {

}

export { 
    newSelector, 
    addSelectorSource,
    editSelectorTitle ,
    editSelectorAnalysis,
    editPipelineObjects,
    deleteSelector,
    editPipelineLinks
}
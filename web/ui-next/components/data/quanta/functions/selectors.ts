import { Dispatch, SetStateAction } from "react"
import { IQuantaSelector, IQuantaSelectorCode } from "../types/project"

const newSelector = (
    selectorName: string, 
    selectorId: string,
    selectors: IQuantaSelector[],
    setSelectors: Dispatch<SetStateAction<IQuantaSelector[]>>
) => {
    let nSelectors = selectors
    nSelectors.push({
        selectorName,
        selectorId,
        selectorDescription: "This is your selectors description. Click to edit."
    })

    setSelectors([ ...nSelectors ])
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

const editSelectorTitle = (

) => {

}

export { 
    newSelector, 
    addSelectorSource,
    editSelectorTitle 
}
import { Dispatch, SetStateAction } from "react"
import { IQuantaSelector } from "../types/project"

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

export { newSelector }
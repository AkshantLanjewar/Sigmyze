import { Dispatch, SetStateAction } from "react"
import { IQuantaSelectorCode, ISelectorLinks } from "../../../../data/quanta/types/project"

const setSelectorLink = (
    datasetId: string, 
    selectorId: string, 
    selectorCode: IQuantaSelectorCode | null,
    setSelectorCode: Dispatch<SetStateAction<IQuantaSelectorCode | null>>
) => {
    if(selectorCode === null)
        return

    let selectorLinks = selectorCode.selectorLinks
    if(selectorLinks === undefined)
        selectorLinks = {} as ISelectorLinks

    let nSelectorCode = selectorCode
    selectorLinks[datasetId] = selectorId
    nSelectorCode.selectorLinks = selectorLinks

    setSelectorCode({ ...nSelectorCode })
}

export { setSelectorLink }
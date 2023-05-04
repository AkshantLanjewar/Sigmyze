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

    let linkKeys = Object.keys(selectorLinks)
    for(let i = 0; i < linkKeys.length; i++) {
        let linkKey = linkKeys[i]
        let linkVal = selectorLinks[linkKey]

        if(linkVal === selectorId)
            selectorLinks[linkKey] = ""
    }

    let nSelectorCode = selectorCode
    selectorLinks[datasetId] = selectorId
    nSelectorCode.selectorLinks = selectorLinks

    setSelectorCode({ ...nSelectorCode })
}

const setReservedLink = (
    reservedId: string,
    selectorId: string,
    pipelineLinks: { [key: string]: string; },
    setPipelineLinks: Dispatch<SetStateAction<{[key: string]: string; }>>,
) => {
    let nLinks: { [key: string]: string; } = { ...pipelineLinks }
    let linkKeys = Object.keys(nLinks)
    for(let i = 0; i < linkKeys.length; i++) {
        let key = linkKeys[i]
        let val = nLinks[key]

        if(val === selectorId)
            nLinks[key] = ""
    }

    nLinks[reservedId] = selectorId
    setPipelineLinks({ ...nLinks })
}

export { setSelectorLink, setReservedLink }
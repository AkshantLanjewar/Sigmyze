import { Dispatch, SetStateAction } from "react"
import { IQuantaState } from "../types"
import { IQuantaProjectData } from "../types/project"

const changeText = (
    text: string, 
    field: "title" | "id" | "desc",
    projectData: IQuantaProjectData | undefined,
    setProjectData: Dispatch<SetStateAction<IQuantaProjectData | undefined>>
) => {
    let nData = projectData
    if(nData === undefined)
        return

    if(field === "title")
        nData.dataset_name = text
    if(field === "id")
        nData.dataset_id = text
    if(field === "desc")
        nData.dataset_description = text
    
    setProjectData({ ...nData })
}

const openModal = (modalId: string, setModalState: Dispatch<SetStateAction<string | null>>) => {
    setModalState(modalId)
}

const activateSelector = (selectorId: string, setActiveSelector: Dispatch<SetStateAction<string | null>>) => {
    setActiveSelector(selectorId)
}

const openSelector = (
    selectorId: string, 
    value: IQuantaState,
    projectData: IQuantaProjectData | undefined,
    setActiveSelector: Dispatch<SetStateAction<string | null>>

) => {
    //get thje file
    let files = projectData?.files
    if(files === undefined)
        return

    let file = null
    for(let i = 0; i < files.length; i++) {
        let file_ = files[i]
        if(file_.type === "selectors")
            file = file_
    }

    if(file === null)
        return
    
    setActiveSelector(selectorId)
}

export { 
    changeText,
    openModal,
    activateSelector,
    openSelector 
}
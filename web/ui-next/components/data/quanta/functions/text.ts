import { Dispatch, SetStateAction } from "react"
import { IQuantaTextStore } from "../types/project"

const setTextValue = (
    id: string, 
    val: string, 
    textStore: IQuantaTextStore,
    setTextStore: Dispatch<SetStateAction<IQuantaTextStore>>
) => {
    let nTextStore = textStore
    nTextStore[id] = val

    setTextStore({ ...nTextStore })
}

export { setTextValue }
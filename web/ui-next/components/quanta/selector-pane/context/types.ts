import { Dispatch, SetStateAction } from "react"
import { IQuantaSelectorCode } from "../../../data/quanta/types/project"

interface ISelectorPaneState {
    initialized: boolean,

    selectorCode: IQuantaSelectorCode | null

    //funcs
    compileProject: (projectData: string) => Promise<any>,

    setTestSource: (source: string | null) => void,

    setSelectorCode: Dispatch<SetStateAction<IQuantaSelectorCode | null>>
}

export type { ISelectorPaneState }
import { IQuantaCodeShort } from "./types"

interface IQuantaCodeContext {
    /**
     * the code projects
     */
    codeItems: IQuantaCodeShort[],

    /**
     * function that updates the project data within the context
     */
    toggleFetch: () => void,

    /**
     * function that deletes a selector
     */
    deleteSelector: (codeId: string) => Promise<void>
}

export type { IQuantaCodeContext }
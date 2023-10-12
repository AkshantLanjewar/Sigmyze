import { useCallback, useContext, useRef, useState } from "react"
import { ISigmyzeFilesystem, ISimpleFilesystem } from "../../../ui/file-management/types"
import { LunarUIContextData } from "../../ui-context"
import { ILunarUIState } from "../../ui-context/state"

/**
 * @description
 *  - this is the hook that abstracts away all the state relating to the SimpleFilesystem in the data-manager
 * 
 * @emits fileSystem
 *  - this is the simple filesystem
 * @emits setFilesystem
 *  - this is the function that sets the simple filesystem
 * @emits ignoreFilesystemSIG
 *  - this is the ref that controls whether or not to ignore the sigmyze filesystem update
 * @emits ignoreFilesystemSIM
 *  - this is the ref that controls whether or not to ignore the simple filesystem update
 * @emits updateUIFilesystem
 *  - this is the method that updates the SigmyzeFilesystem in the UI Context
 * @emits updateDataFilesystem
 *  - this is the method that updates the SimpleFilesystem in the data context
 */
const useRefreshFilesystem = () => {
    const { setLoadedFilesystem } = useContext(LunarUIContextData) as ILunarUIState

    //this is the simpleform version of the filesystem
    const [fileSystem, setFilesystem] = useState<ISimpleFilesystem | undefined>(undefined)
    //this flag is so that we dont update the tracked simplefilesystem when a change occurs to the more complex shape
    const ignoreFilesystemSIG = useRef<boolean>(false)
    //this flag is so that we dont update the sigmyzefilesystem when we update the filesystem
    const ignoreFilesystemSIM = useRef<boolean>(false)

    /**
     * this functions sets the necessary flags in order to make updating the ui filesystem easier
     */
    const updateUIFilesystem = useCallback((filesystem: ISigmyzeFilesystem) => {
        ignoreFilesystemSIG.current = true
        setLoadedFilesystem({ ...filesystem })
    }, [])

    /**
     * this function sets the necessary flags in order to make updating the simple filesystem easier
     */
    const updateDataFilesystem = useCallback((fileSystem: ISimpleFilesystem) => {
        ignoreFilesystemSIM.current = true
        setFilesystem({ ...fileSystem })
    }, [])

    return {
        fileSystem,
        ignoreFilesystemSIG,
        ignoreFilesystemSIM,
        setFilesystem,
        updateUIFilesystem,
        updateDataFilesystem
    }
}

export default useRefreshFilesystem
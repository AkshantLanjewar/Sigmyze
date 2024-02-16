import { Dispatch, SetStateAction, useCallback } from "react"
import { ISigmyzeFilesystem } from "../../../ui/file-management/types"
import { grabFile } from "../../data-manager/functions"
import { editFileTitle } from "../functions/file"

/**
 * @description
 * @param loadedFilesystem 
 */
const useSigmyzeFilesystemUtil = (
    loadedFilesystem: string | undefined,
    setLoadedFilesystem: Dispatch<SetStateAction<string | undefined>>,
    addEditTitleSynchroMessage?: (fileType: string, fileId: string, fileName: string) => void
) => {
    const getFileById = useCallback((fileId: string) => {
        if(loadedFilesystem === undefined)
            return

        let parsedFilesystem: ISigmyzeFilesystem = JSON.parse(loadedFilesystem)
        return grabFile(parsedFilesystem, fileId)
    }, [loadedFilesystem])

    const editFileTitleCB = useCallback((fileId: string, fileType: string, newTitle: string) => {
        if(loadedFilesystem === undefined)
            return

        let parsedFilesystem: ISigmyzeFilesystem = JSON.parse(loadedFilesystem)
        let newFilesystem = editFileTitle(parsedFilesystem, fileId, newTitle)
        setLoadedFilesystem(JSON.stringify(newFilesystem))
        if(addEditTitleSynchroMessage !== undefined)
            addEditTitleSynchroMessage(fileType, fileId, newTitle)
    }, [loadedFilesystem, addEditTitleSynchroMessage])

    return {
        getFileById,
        editFileTitle: editFileTitleCB
    }
}

export default useSigmyzeFilesystemUtil
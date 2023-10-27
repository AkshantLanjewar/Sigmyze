import { Dispatch, SetStateAction, useCallback } from "react"
import { ISigmyzeFilesystem } from "../../../ui/file-management/types"
import { grabFile } from "../../data-manager/functions"
import { editFileTitle } from "../functions/file"

/**
 * @description
 * @param loadedFilesystem 
 */
const useSigmyzeFilesystemUtil = (
    loadedFilesystem: ISigmyzeFilesystem | undefined,
    setLoadedFilesystem: Dispatch<SetStateAction<ISigmyzeFilesystem | undefined>>,
    addEditTitleSynchroMessage?: (fileType: string, fileId: string, fileName: string) => void
) => {
    const getFileById = useCallback((fileId: string) => {
        if(loadedFilesystem === undefined)
            return

        return grabFile(loadedFilesystem, fileId)
    }, [loadedFilesystem])

    const editFileTitleCB = useCallback((fileId: string, fileType: string, newTitle: string) => {
        if(loadedFilesystem === undefined)
            return

        let newFilesystem = editFileTitle(loadedFilesystem, fileId, newTitle)
        setLoadedFilesystem({ ...newFilesystem })
        if(addEditTitleSynchroMessage !== undefined)
            addEditTitleSynchroMessage(fileType, fileId, newTitle)
    }, [loadedFilesystem, addEditTitleSynchroMessage])

    return {
        getFileById,
        editFileTitle: editFileTitleCB
    }
}

export default useSigmyzeFilesystemUtil
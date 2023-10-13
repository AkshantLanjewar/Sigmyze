import { useCallback } from "react"
import { ISigmyzeFilesystem } from "../../../ui/file-management/types"
import { grabFile } from "../../data-manager/functions"

/**
 * @description
 * @param loadedFilesystem 
 */
const useSigmyzeFilesystemUtil = (
    loadedFilesystem: ISigmyzeFilesystem | undefined
) => {
    const getFileById = useCallback((fileId: string) => {
        if(loadedFilesystem === undefined)
            return

        return grabFile(loadedFilesystem, fileId)
    }, [loadedFilesystem])

    return {
        getFileById
    }
}

export default useSigmyzeFilesystemUtil